# --- Estágio Base ---
# Usamos uma imagem Node.js completa que inclui ferramentas de build.
# A versão 18 é a LTS (Long-Term Support) recomendada pelo Next.js.
FROM node:18-alpine AS base
# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# --- Estágio de Dependências ---
# Este estágio é dedicado a instalar as dependências. O Docker fará cache
# desta camada, e ela só será reconstruída se o package.json ou package-lock.json mudar.
FROM base AS deps
# Copia os arquivos de manifesto de pacotes para a raiz do app.
COPY package.json package-lock.json* ./
# Instala TODAS as dependências (incluindo devDependencies).
RUN npm install

# --- Estágio de Desenvolvimento ---
# Este é o estágio final que será usado para rodar o ambiente de dev.
FROM base AS development
# Define o diretório de trabalho.
WORKDIR /app
# Copia as dependências já instaladas do estágio 'deps'.
# Isso é muito mais rápido do que reinstalar tudo a cada mudança de código.
COPY --from=deps /app/node_modules ./node_modules
# Copia todo o resto do código-fonte do seu projeto.
COPY . .

# Expõe a porta que o servidor de desenvolvimento do Next.js usa.
EXPOSE 3000

# Comando para iniciar o servidor de desenvolvimento do Next.js.
# O '-- -H 0.0.0.0' é crucial para que o servidor seja acessível de fora do contêiner.
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
