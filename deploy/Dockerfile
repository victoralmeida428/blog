# Dockerfile.prod (para estrutura Next.js padrão)

# --- Estágio de Dependências (Base) ---
# Instala apenas as dependências necessárias para rodar a aplicação.
FROM node:18-alpine AS deps
WORKDIR /opt/blog
# Copia os arquivos de manifesto do projeto.
COPY package.json package-lock.json* ./
# Instala apenas as dependências de produção.
# '--omit=dev' é o equivalente a '--production' no npm moderno.
RUN npm install --omit=dev

# --- Estágio de Build ---
# Este estágio compila o código TypeScript/React para JavaScript puro e otimizado.
FROM node:18-alpine AS builder
WORKDIR /opt/blog
# Copia todo o código-fonte.
COPY . .
# Instala TODAS as dependências (incluindo devDependencies como typescript)
# necessárias para o processo de build.
RUN npm install
# Executa o build de produção.
RUN npm run build

# --- Estágio Final (Produção) ---
# Esta é a imagem final, que será muito menor e mais segura.
FROM node:18-alpine AS runner
WORKDIR /opt/blog

# Define o ambiente para 'production', desabilitando features de dev do Next.js.
ENV NODE_ENV=production

# Cria um usuário e grupo 'nextjs' para rodar a aplicação com menos privilégios.
# Rodar como 'root' em produção é uma má prática de segurança.
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

# Copia as dependências de produção do estágio 'deps'.
COPY --from=deps /opt/blog/node_modules ./node_modules
# Copia o package.json para que o Next.js possa encontrá-lo.
COPY --from=builder /opt/blog/package.json ./package.json
# Copia a pasta .next com o build de produção.
COPY --from=builder /opt/blog/.next ./.next
# Copia a pasta 'public' se houver arquivos estáticos (imagens, fontes).
COPY --from=builder /opt/blog/public ./public
# Copia o next.config.ts (ou .js) que pode ser necessário em tempo de execução.
COPY --from=builder /opt/blog/next.config.ts ./

# Muda o proprietário dos arquivos para o usuário 'nextjs' que criamos.
RUN chown -R nextjs:nextjs .

# Muda para o usuário não-root.
USER nextjs

# Expõe a porta que a aplicação vai rodar.
EXPOSE 3000

# Comando para iniciar o servidor de produção do Next.js.
CMD ["npm", "start"]
