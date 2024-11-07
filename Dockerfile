# ベースイメージとしてRuby 3.2を使用
FROM ruby:3.1.4

# 必要なパッケージをインストール
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

# 作業ディレクトリを指定
WORKDIR /portfolio

# GemfileとGemfile.lockをコピーし、bundlerを実行
COPY Gemfile* ./
RUN gem install bundler && bundle install

# アプリケーションファイルをすべてコピー
COPY . .

# 開発サーバーを起動するコマンドを指定
CMD ["bin/rails", "server", "-b", "0.0.0.0"]