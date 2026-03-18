#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.js
window.env = {
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL}",
  VITE_SUPABASE_ANON_KEY: "${VITE_SUPABASE_ANON_KEY}"
};
EOF

echo "✅ env's injetadas com sucesso!"
exec "$@"
