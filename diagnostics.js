
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nqvnyttvshskatidqjyk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdm55dHR2c2hza2F0aWRxanlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzY1ODksImV4cCI6MjA1NjgxMjU4OX0.O-fPndYvW0R6K8PIdfNisIe9v8Y4Zz-I9XwI5N7Y-wI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHealth() {
    console.log("--- BUSINESSES ---");
    const { data: b } = await supabase.from('businesses').select('*');
    console.table(b);

    console.log("--- USERS ---");
    const { data: u } = await supabase.from('users').select('*');
    console.table(u);

    console.log("--- TRANSACTIONS ---");
    const { data: t } = await supabase.from('transactions').select('*');
    console.table(t);

    console.log("--- PRODUCTS ---");
    const { data: p } = await supabase.from('products').select('*');
    console.table(p);
}

checkHealth();
