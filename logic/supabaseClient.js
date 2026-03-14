/**
 * Alien San - Supabase Client
 * Reemplaza los valores de URL y Key con tus credenciales de Supabase.
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Estas credenciales deben ser proporcionadas por el usuario
const SUPABASE_URL = 'https://vmnzwypdxdzosefyzygs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mWFub1NEn7Qmb0By_zqdnQ_FR71qZkB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
