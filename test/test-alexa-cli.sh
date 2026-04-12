#!/bin/bash
# End-to-end test script for Alexa Story Time skill via ASK CLI
# Usage: bash test/test-alexa-cli.sh

SKILL_ID="amzn1.ask.skill.5ccffded-9bba-4373-86c7-dbf610cc9b34"
STAGE="development"
LOCALE="en-US"
PASS=0
FAIL=0

simulate() {
  local desc="$1"
  local input="$2"
  local expect="$3"

  # Start simulation
  local sim_id
  sim_id=$(ask smapi simulate-skill \
    --skill-id "$SKILL_ID" \
    --stage "$STAGE" \
    --device-locale "$LOCALE" \
    --input-content "$input" 2>&1 | python3 -c "import json,sys; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)

  if [ -z "$sim_id" ]; then
    echo "  FAIL  $desc — could not start simulation"
    FAIL=$((FAIL + 1))
    return
  fi

  # Wait and get result
  sleep 8
  local result
  result=$(ask smapi get-skill-simulation \
    --skill-id "$SKILL_ID" \
    --stage "$STAGE" \
    --simulation-id "$sim_id" 2>&1)

  local status
  status=$(echo "$result" | python3 -c "import json,sys; print(json.load(sys.stdin).get('status',''))" 2>/dev/null)

  if [ "$status" = "IN_PROGRESS" ]; then
    sleep 5
    result=$(ask smapi get-skill-simulation \
      --skill-id "$SKILL_ID" \
      --stage "$STAGE" \
      --simulation-id "$sim_id" 2>&1)
  fi

  local speech
  speech=$(echo "$result" | python3 -c "
import json, sys
d = json.load(sys.stdin)
r = d.get('result', {})
err = r.get('error', {}).get('message', '')
if err:
    print('ERROR: ' + err)
else:
    for inv in r.get('skillExecutionInfo', {}).get('invocations', []):
        s = inv.get('invocationResponse', {}).get('body', {}).get('response', {}).get('outputSpeech', {}).get('ssml', '')
        print(s[:300])
" 2>/dev/null)

  if echo "$speech" | grep -qi "$expect"; then
    echo "  PASS  $desc"
    PASS=$((PASS + 1))
  else
    echo "  FAIL  $desc"
    echo "        Expected: $expect"
    echo "        Got: ${speech:0:200}"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Alexa Story Time — E2E Tests ==="
echo ""

echo "--- Launch & Navigation ---"
simulate "Launch skill" "open story time" "Welcome to Story Time"
simulate "Ask for help" "help" "play a story"
simulate "List stories" "list stories" "Leo"

echo ""
echo "--- Play Stories ---"
simulate "Play latest story" "play a story" "Leo and the Firefly"
simulate "Play by name (Monkey)" "play the monkey and the crocodile" "Monkey"
simulate "Play by name (Birbal)" "play birbal counts the crows" "Birbal"
simulate "Play not found" "play the invisible unicorn" "could not find"

echo ""
echo "--- Language Switching ---"
simulate "Switch to Hindi" "hindi" "Hindi"
simulate "Switch to English" "english" "English"

echo ""
echo "--- Stop & Cancel ---"
simulate "Stop skill" "stop" "Goodbye"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
exit $FAIL
