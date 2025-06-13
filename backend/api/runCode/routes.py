from fastapi import APIRouter
from schemas.runCode import MultiJudgeRequest

router = APIRouter()

def run_python(code):
    import subprocess
    try:
        proc = subprocess.run(
            ["python3", "-c", code],
            capture_output=True, timeout=3, text=True
        )
        return {
            "stdout": proc.stdout,
            "stderr": proc.stderr,
            "returncode": proc.returncode
        }
    except Exception as e:
        return {"error": str(e)}

def run_cpp(code):
    import subprocess, tempfile, os
    with tempfile.TemporaryDirectory() as tempdir:
        source_file = os.path.join(tempdir, "main.cpp")
        exe_file = os.path.join(tempdir, "main.out")
        with open(source_file, "w") as f:
            f.write(code)
        compile_proc = subprocess.run(
            ["g++", source_file, "-o", exe_file],
            capture_output=True, text=True
        )
        if compile_proc.returncode != 0:
            return {
                "stdout": "",
                "stderr": compile_proc.stderr,
                "returncode": compile_proc.returncode
            }
        try:
            run_proc = subprocess.run(
                [exe_file],
                capture_output=True, timeout=3, text=True
            )
            return {
                "stdout": run_proc.stdout,
                "stderr": run_proc.stderr,
                "returncode": run_proc.returncode
            }
        except Exception as e:
            return {"error": str(e)}

LANGUAGE_RUNNERS = {
    "python": run_python,
    "cpp": run_cpp,
    # Add more languages here easily!
}

@router.post("/run_code")
def CodeRunner(req: MultiJudgeRequest):
    results = []
    runner = LANGUAGE_RUNNERS.get(req.language)
    if not runner:
        return {"error": f"Unsupported language: {req.language}"}
    for code in req.codes:
        results.append(runner(code))
    return results