# ベースイメージを指定
FROM ruby:3.1.4

# Node.jsとYarnをインストール（より安定した方法を使用）
RUN apt-get update -qq && \
    apt-get install -y curl gnupg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update -qq && \
    apt-get install -y nodejs postgresql-client && \
    npm install -g yarn

# 作業ディレクトリを指定
WORKDIR /portfolio

# package.jsonとyarn.lockをコピー（存在する場合）
COPY package*.json yarn*.lock ./
RUN yarn install --frozen-lockfile || yarn install

# GemfileとGemfile.lockをコピーし、bundlerを実行
COPY Gemfile Gemfile.lock ./
RUN gem install bundler && bundle install

# アプリケーションファイルをすべてコピー
COPY . .

# コンテナ起動時に実行されるコマンド
CMD ["bin/rails", "server", "-b", "0.0.0.0"]