---
name: skill-creator-anthropic
description: Create new skills and iteratively improve them using evaluation-driven development. Use when users want to create a skill from scratch, edit or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy. This is the Anthropic skill-creator adapted for OpenClaw with hybrid Bash/Python tooling.
---

# Skill Creator (Anthropic/OpenClaw Hybrid)

A skill for creating new skills and iteratively improving them using evaluation-driven development.

This version is **adapted for OpenClaw** from the original Anthropic skill-creator. It combines:
- **Bash scripts** for OpenClaw integration (`sessions_spawn`, `sessions_yield`)
- **Python scripts** for statistics and reporting (aggregation, benchmark viewer)

## Process Overview

At a high level, creating a skill works like this:

1. **Decide** what the skill should do and how
2. **Write** a draft of the SKILL.md
3. **Create** test prompts and run evaluations
4. **Evaluate** results qualitatively and quantitatively
5. **Iterate** based on feedback
6. **Expand** the test set and repeat at scale

Your job is to figure out where the user is in this process and help them progress.

---

## OpenClaw Adaptations

### Running Evaluations

Instead of `claude -p` (Anthropic CLI), use the OpenClaw wrappers:

```bash
# Single eval
./scripts/openclaw-wrappers/run-eval-openclaw.sh \
    ../my-skill \
    "Créer un fichier test.txt" \
    -n "test-fichier" \
    -b  # with baseline

# Batch eval
./scripts/openclaw-wrappers/run-batch-eval.sh \
    ../my-skill \
    ../my-skill/evals/evals.json \
    -b -i 1
```

### Spawning Sessions

For actual execution, spawn sessions with the skill loaded:

```bash
# With skill
sessions_spawn \
    --label "eval-0-with" \
    --file ../my-skill/SKILL.md \
    --task "Prompt de test" \
    --mode run

# Without skill (baseline)
sessions_spawn \
    --label "eval-0-without" \
    --task "Prompt de test" \
    --mode run
```

### Aggregating Results

Use the Python script (generic, no Anthropic deps):

```bash
python3 scripts/aggregate_benchmark.py \
    workspace/iteration-1/ \
    --skill-name my-skill
```

---

## Creating a Skill

### Capture Intent

Understand what the user wants:

1. **What** should this skill enable Claude to do?
2. **When** should this skill trigger? (user phrases/contexts)
3. **What's** the expected output format?
4. **Should** we set up test cases? (objective outputs benefit most)

### Interview and Research

Ask about:
- Edge cases
- Input/output formats
- Example files
- Success criteria
- Dependencies

### Write SKILL.md

Structure:
```yaml
---
name: skill-name
description: When to trigger, what it does. Be explicit and "pushy" 
             about triggering contexts.
---

# Skill Title

Instructions here...
```

### Anatomy of a Skill

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/    - Executable code
    ├── references/ - Documentation
    └── assets/     - Templates, icons, etc.
```

### Test Cases

Create `evals/evals.json`:

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's task prompt",
      "expected_output": "Description of expected result",
      "files": []
    }
  ]
}
```

---

## Running Evaluations (OpenClaw Flow)

### Step 1: Setup workspace

```bash
mkdir -p workspace/iteration-1
cd workspace/iteration-1
```

### Step 2: Spawn all runs

For each test case, spawn TWO sessions in parallel:

**With skill:**
```bash
sessions_spawn \
    --label "eval-${ID}-with" \
    --file /path/to/skill/SKILL.md \
    --task "${PROMPT}" \
    --mode run
```

**Without skill (baseline):**
```bash
sessions_spawn \
    --label "eval-${ID}-without" \
    --task "${PROMPT}" \
    --mode run
```

**Important:** Spawn both in the same turn so they finish around the same time.

### Step 3: Capture timing data

After each session completes, record:
```json
{
  "total_tokens": 84852,  # From session_status if available
  "duration_ms": 23332,   # Calculate from timestamps
  "start_time": "...",
  "end_time": "..."
}
```

Save to `workspace/iteration-N/eval-X/{with,without}_skill/timing.json`

### Step 4: Grade and aggregate

Once all runs complete:

1. **Grade each run** - Read outputs, evaluate assertions
2. **Save results** to `grading.json` in each run directory
3. **Run aggregation:**
   ```bash
   python3 scripts/aggregate_benchmark.py \
       workspace/iteration-N \
       --skill-name my-skill
   ```

4. **Launch viewer:**
   ```bash
   python3 eval-viewer/generate_review.py \
       workspace/iteration-N \
       --output review.html
   ```

### Step 5: Analyze and iterate

Review the benchmark data:
- Pass rates
- Time/token tradeoffs
- Patterns across evals

Then rewrite the skill and repeat.

---

## Tools Reference

### Bash Scripts (OpenClaw-specific)

| Script | Purpose |
|--------|---------|
| `run-eval-openclaw.sh` | Run single eval with/without skill |
| `run-batch-eval.sh` | Run multiple evals in batch |

### Python Scripts (Generic)

| Script | Purpose |
|--------|---------|
| `aggregate_benchmark.py` | Aggregate stats across runs |
| `generate_report.py` | Generate evaluation report |
| `generate_review.py` | Create HTML review viewer |
| `improve_description.py` | Optimize skill description |

---

## Key Differences from Anthropic Version

| Feature | Anthropic | OpenClaw |
|---------|-----------|----------|
| Session spawning | `claude -p` | `sessions_spawn` |
| Notification metrics | Auto in notification | Manual capture |
| IDE commands | `/skill-test` | Not available |
| Parallel execution | Built-in | Manual with labels |

---

## Best Practices

1. **Start small** - 2-3 evals for first iteration
2. **Baseline everything** - Compare with/without skill
3. **Iterate quickly** - Don't over-engineer first draft
4. **Be pushy** - Make descriptions explicit about when to trigger
5. **Stay flexible** - Skip evaluations if user says "just vibe"

---

## Resources

- `agents/grader.md` - Grading agent prompt
- `agents/analyzer.md` - Analysis agent prompt
- `references/schemas.md` - JSON schemas

Original: https://github.com/anthropics/skills/tree/main/skills/skill-creator
