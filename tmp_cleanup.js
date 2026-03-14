
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nqvnyttvshskatidqjyk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdm55dHR2c2hza2F0aWRxanlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzY1ODksImV4cCI6MjA1NjgxMjU4OX0.O-fPndYvW0R6K8PIdfNisIe9v8Y4Zz-I9XwI5N7Y-wI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndClean() {
    const { data: businesses, error } = await supabase.from('businesses').select('*');
    if (error) {
        console.error("Error fetching businesses:", error);
        return;
    }

    console.log("Current Businesses in DB:");
    console.table(businesses.map(b => ({ id: b.id, name: b.name, type: b.type })));

    // Identify duplicates by name
    const seenNames = new Set();
    const toDelete = [];

    businesses.forEach(b => {
        if (!b.name || b.name.trim() === "" || b.name === "Mi Negocio Alien") {
            toDelete.push(b.id);
        } else if (seenNames.has(b.name)) {
            toDelete.push(b.id);
        } else {
            seenNames.add(b.name);
        }
    });

    if (toDelete.length > 0) {
        console.log("Deleting duplicate/empty IDs:", toDelete);
        const { error: delError } = await supabase.from('businesses').delete().in('id', toDelete);
        if (delError) console.error("Error deleting:", delError);
        else console.log("Clean up successful.");
    } else {
        console.log("No duplicates found.");
    }
}

checkAndClean();
