insert into users (id, organization_id, full_name, email, role)
values
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Aegis Admin', 'admin@aegis.local', 'owner'),
  ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Campaign Manager', 'manager@aegis.local', 'campaign_manager')
on conflict (email) do nothing;

insert into customers (id, organization_id, full_name, phone_e164, email, preferred_language, region, city, state, risk_score, payment_likelihood, tags)
values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Ananya Rao', '+91982112401', 'ananya@example.com', 'hi', 'North', 'Delhi', 'Delhi', 31, 78, array['bucket-1','salary']),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Rahul Verma', '+91881209014', 'rahul@example.com', 'en', 'West', 'Mumbai', 'Maharashtra', 68, 42, array['high-balance']),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Kavya Menon', '+91771821922', 'kavya@example.com', 'ml', 'South', 'Kochi', 'Kerala', 18, 86, array['vernacular'])
on conflict (organization_id, phone_e164) do nothing;

insert into loans (id, organization_id, customer_id, external_loan_id, product_type, principal_amount, outstanding_amount, overdue_amount, emi_amount, due_date, dpd, bucket)
values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'LN-1001', 'personal_loan', 250000, 18400, 18400, 9200, current_date + interval '3 days', 12, '1-30'),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'LN-1002', 'sme_loan', 900000, 96200, 96200, 32100, current_date + interval '1 day', 26, '1-30'),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'LN-1003', 'auto_loan', 480000, 12350, 12350, 12350, current_date + interval '7 days', 8, '1-30')
on conflict (organization_id, external_loan_id) do nothing;

insert into agent_configurations (id, organization_id, name, persona, system_prompt, languages, voice_provider, llm_provider, llm_model, flow_definition, objection_library, compliance_rules, created_by)
values (
  '40000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Asha Collections Agent',
  'Empathetic but firm collections specialist for regulated EMI reminders.',
  'Verify identity before disclosure. Explain overdue EMI clearly. Handle objections with empathy. Capture promise to pay only after the customer confirms amount and date.',
  array['en','hi','ta','te','ml','kn'],
  'vapi',
  'openai',
  'gpt-4o',
  '{"nodes":["verify_customer","emi_reminder","objection_handling","payment_commitment","callback","summary"]}',
  '[{"name":"salary_delayed","response":"Acknowledge hardship and propose partial payment."},{"name":"already_paid","response":"Ask for reference and pause collection pressure."}]',
  '{"identity_required":true,"no_threats":true,"no_third_party_disclosure":true}',
  '00000000-0000-0000-0000-000000000001'
) on conflict (organization_id, name, version) do nothing;

insert into campaigns (id, organization_id, agent_configuration_id, name, description, status, collection_target, due_customer_count, success_rate, filters, created_by)
values (
  '50000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000001',
  'Prime Bucket 1 - North',
  'Seed campaign for EMI reminders and promise-to-pay tracking.',
  'draft',
  84000000,
  3,
  42.1,
  '{"bucket":"1-30","languages":["hi","en"]}',
  '00000000-0000-0000-0000-000000000001'
) on conflict (organization_id, name) do nothing;
