// supabase-config.js
import { createClient } from '@supabase/supabase-js'

// URL do seu projeto Supabase
const supabaseUrl = 'https://lvegldhtgalibbkmhzfz.supabase.co'

// Chave anônima (pública) - NÃO é a chave secreta/service_role
const supabaseKey = 'sua-chave-anon-aqui'

// Criar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)