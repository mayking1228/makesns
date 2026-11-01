import importlib.util
from pathlib import Path
import tempfile
import unittest
from types import SimpleNamespace

spec = importlib.util.spec_from_file_location('credentials', Path(__file__).parents[2] / 'scripts/write-deploy-credentials.py')
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class CredentialTests(unittest.TestCase):
    def test_generated_private_key_accepts_crlf_and_missing_final_newline(self):
        import subprocess
        with tempfile.TemporaryDirectory() as temp:
            original = Path(temp) / 'source'
            subprocess.run(['ssh-keygen', '-q', '-t', 'ed25519', '-N', '', '-f', str(original)], check=True)
            public = Path(str(original) + '.pub').read_text()
            expected = original.read_text()
            target = Path(temp) / 'written'
            mod.write_credentials(target, {'DEPLOY_KEY': expected.rstrip().replace('\n', '\r\n'), 'KNOWN_HOSTS': '139.162.84.156 ' + public})
            self.assertEqual((target / 'key').read_text(), expected)
            self.assertEqual((target / 'key').stat().st_mode & 0o777, 0o600)

    def test_public_key_path_and_escaped_newlines_reject_without_provider_call(self):
        with tempfile.TemporaryDirectory() as temp:
            for value in ['ssh-ed25519 public-only', '/root/.config/makesns-deploy/github-actions', '-----BEGIN OPENSSH PRIVATE KEY-----\\nvalue\\n-----END OPENSSH PRIVATE KEY-----']:
                with self.subTest(value=value):
                    with self.assertRaisesRegex(ValueError, 'MAKESNS_SSH_KEY'):
                        mod.write_credentials(temp, {'DEPLOY_KEY': value, 'KNOWN_HOSTS': 'host'}, run=lambda *a, **k: self.fail('must reject before subprocess'))

    def test_corrupt_key_has_actionable_error_without_secret_details(self):
        key = '-----BEGIN OPENSSH PRIVATE KEY-----\nsecret-placeholder\n-----END OPENSSH PRIVATE KEY-----'
        with tempfile.TemporaryDirectory() as temp:
            with self.assertRaises(ValueError) as error:
                mod.write_credentials(temp, {'DEPLOY_KEY': key, 'KNOWN_HOSTS': 'host'}, run=lambda *a, **k: SimpleNamespace(returncode=255))
            self.assertNotIn('secret-placeholder', str(error.exception))
            self.assertIn('다시 복사', str(error.exception))

    def test_known_host_must_match_pinned_address(self):
        key = '-----BEGIN OPENSSH PRIVATE KEY-----\nplaceholder\n-----END OPENSSH PRIVATE KEY-----'
        calls = []
        def run(args, **kw):
            calls.append(args)
            return SimpleNamespace(returncode=0 if len(calls)==1 else 1)
        with tempfile.TemporaryDirectory() as temp:
            with self.assertRaisesRegex(ValueError, 'MAKESNS_SSH_KNOWN_HOSTS'):
                mod.write_credentials(temp, {'DEPLOY_KEY': key, 'KNOWN_HOSTS': 'wrong-host'}, run=run)

if __name__ == '__main__':
    unittest.main()
