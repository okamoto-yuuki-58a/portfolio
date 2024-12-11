# 開発環境ではホスト制限を解除
Rails.application.config.hosts = nil if Rails.env.development?

# 本番環境では特定のホストのみを許可
if Rails.env.production?
  # Renderの特定のドメインを許可
  Rails.application.config.hosts << "portfolio-vgy6.onrender.com"
  
  # 環境変数からホスト名を設定（より柔軟な設定のため）
  Rails.application.config.hosts << ENV['RENDER_EXTERNAL_HOSTNAME'] if ENV['RENDER_EXTERNAL_HOSTNAME'].present?
  
  # Renderのすべてのサブドメインを許可（オプション）
  # Rails.application.config.hosts << ".onrender.com"
end