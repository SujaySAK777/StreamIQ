-- add promotion_decisions table for audit logging
CREATE TABLE IF NOT EXISTS promotion_decisions (
  id SERIAL PRIMARY KEY,
  decision_id uuid NOT NULL,
  product_id uuid NULL,
  input_event jsonb NULL,
  uplift_score numeric NULL,
  candidates jsonb NULL,
  chosen_candidate jsonb NULL,
  llm_response jsonb NULL,
  outcome text NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promotion_decisions_product_id ON promotion_decisions(product_id);
CREATE INDEX IF NOT EXISTS idx_promotion_decisions_created_at ON promotion_decisions(created_at DESC);
