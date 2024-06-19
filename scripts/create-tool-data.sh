# Deployment script.
# Compiles the data provided on tools into a single json to use dynamically at runtime.

TOOL_PATH="src/routes/tool/"

find "$TOOL_PATH" -mindepth 2 -name "overview-data.json" | xargs jq -s '.' > "$TOOL_PATH/overview-data.json"
