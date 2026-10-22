#!/usr/bin/env python3
"""Verify the recovered snapshot; --live compares every file to its public source."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--live', action='store_true')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'recovery-manifest.json').read_text())
expected = {item['path'] for item in manifest['files']}
actual = {p.relative_to(root / 'public').as_posix() for p in (root / 'public').rglob('*') if p.is_file()}
assert actual == expected, f'Inventory mismatch: {actual ^ expected}'
for item in manifest['files']:
    data = (root / 'public' / item['path']).read_bytes()
    assert len(data) == item['bytes'], item['path']
    assert hashlib.sha256(data).hexdigest() == item['sha256'], item['path']
    if args.live:
        remote = subprocess.check_output(['curl', '--fail', '--silent', '--show-error', '--location', '--retry', '2', '--max-time', '120', item['url']])
        assert remote == data, f'Live content differs: {item["path"]}'
    print('OK', item['path'])
print(f'Verified {len(expected)} files' + (' against live bytes.' if args.live else '.'))
