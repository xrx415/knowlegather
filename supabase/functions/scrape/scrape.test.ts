import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://fyebojtynxasphohnrjh.supabase.co",
  process.env.SUPABASE_ANON_KEY
);

test('Fetch data from supabase', async () => {
  const { data, error } = await supabase
    .from('collections')
    .select('*');

  expect(error).toBeNull();
  expect(data).not.toBeNull();
  expect(data.length).toBeGreaterThan(0);
});
