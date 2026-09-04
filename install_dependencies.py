"""Install the Node.js dependencies listed by this project."""

from pathlib import Path
import os
import shutil
import subprocess
import sys


PROJECT_DIR = Path(__file__).resolve().parent
REQUIREMENTS_FILE = PROJECT_DIR / "requirements.txt"


def package_count() -> int:
    """Count npm package entries in the npm-style requirements file."""
    if not REQUIREMENTS_FILE.exists():
        raise FileNotFoundError(f"Missing {REQUIREMENTS_FILE.name}")

    entries = []
    for line in REQUIREMENTS_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and not line.startswith(("node ", "npm ")):
            entries.append(line)
    return len(entries)


def main() -> int:
    if not (PROJECT_DIR / "package.json").exists():
        print("Error: package.json was not found.", file=sys.stderr)
        return 1
    if not (PROJECT_DIR / "package-lock.json").exists():
        print("Error: package-lock.json was not found.", file=sys.stderr)
        return 1
    if shutil.which("node") is None or shutil.which("npm") is None:
        print("Error: Node.js and npm must be installed and available on PATH.", file=sys.stderr)
        return 1

    try:
        count = package_count()
    except (OSError, FileNotFoundError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print(f"Installing {count} npm packages from requirements.txt and package-lock.json...")
    npm_command = "npm.cmd" if os.name == "nt" else "npm"
    result = subprocess.run([npm_command, "ci"], cwd=PROJECT_DIR)
    if result.returncode != 0:
        print(
            "\nDependency installation failed. On Windows, close any running "
            "Next.js/Node.js process and run this script again.",
            file=sys.stderr,
        )
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())