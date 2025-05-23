## Sobre o projeto

O Candy-Shop Web é o sistema web ERP responsável por gerenciar e administrar os produtos, pedidos e caixa da Casa do Confeiteiro.
Para rodá-lo é necessário ter o Node instalado. Durante a construção do projeto, foi utilizado a última versão dispoível, portanto você pode utilizar a versão mais atualizada sem problemas :D

## Rodando local manual

O projeto utiliza o "pnpm" como gerenciador padrão de pacotes, portanto, caso não possua o mesmo instalado, instale-o rodando:

```bash
npm intall -g pnpm
```

Em seguida, instale os pacotes rodando:

```bash
pnpm install
```

Após instalação dos pacotes, verifique as variáveis de ambiente no .env-example, e caso necessário, crie um .env para rodar localmente, utilizando as configurações
fornecidas pelo env de exemplo.

Em seguida, suba o projeto localmente, rodando:

```bash
pnpm dev
```

Após receber a resposta "Servidor Rodando" no console, o servidor já está pronto para receber requisições.

## Documentação das rotas

A documentação das rotas foi feita utilizando o Insomnia Documenter. Dentro da pasta "docs", existe um arquivo .json, o qual é possível exportar para dentro do Insomnia e carregar a lista de rotas.
Para realizar o carregamento da interface WEB (estilo Swagger), siga os seguintes passsos:

Instale o insomnia documenter:

```bash
pnpm add -g insomnia-documenter
```

e

```bash
pnpm add -g serve
```

Em seguida, navegue até o diretório contendo os arquivos das docs, e execute:

```bash
insomnia-documenter --config "Insomnia.json"
```

Em seguida, ainda na mesma pasta, execute:

```bash
serve
```

Você verá uma mensagem no console indicando que o servidor está respondendo na porta 3000 (padrão). Em seguida, basta acessar o navegador na porta indicada e navegar entre as páginas.
