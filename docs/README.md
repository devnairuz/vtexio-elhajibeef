# Tema Diamond Base Vtex

Este tema foi desenvolvido para utilizarmos como base para novos projetos na plataforma VTEX,
o tema se encontra online na URL [Tema Diamond](https://diamond--agencianairuzpartnerbr.myvtex.com/)

## Configuração

### Passo 1 - Acesse o repositório GIT para utilizar o template

Acesse o repositório git em [Tema Diamond](https://github.com/devnairuz/diamond) e clique em 'Use this template', para gerar um novo repositório a partir desse e assim poder fazer o clone para o ambiente local. 

### Step 2 - Clone o novo repositório criado

Após realizar o passo 1, faça o clone do novo repositório criado para o ambiente local.

### Step 3 - Edite o `manifest.json`

Após realizado o clone para o ambiente local, abra a pasta do projeto no seu editor de preferencia e faça as devidas edições no arquivo `manifest.json`. 

No arquivo edite os valores de `vendor` e `name`. `vendor` é a conta do cliente que será utilizada no novo projeto e `name` é o nome do projeto a ser iniciado, podendo ser qualquer nome a sua escolha, por exemplo:

```json
{
  "vendor": "agencianairuzpartnerbr",
  "name": "diamond",
}
```

### Step 4 - Faça login na conta do cliente

Com o template já baixado no ambiente local, utilize o prompt de comando de preferencia e faça login na conta fornecida pelo cliente, utilize o seguinte comando.: vtex login conta-do-cliente, por exemplo.: vtex login agencianairuzpartnerbr

### Step 5 - Crie um novo workspace

Faça a criação de um novo workspace de desenvolvimento rodando o seguinte comando no terminal.: vtex use nome-do-workspace, serão apresentados algumas perguntas, basta responde-las para que seja criado o novo ambiente de desenvolvimento, por exemplo.: vtex use homolog

### Step 6 - Instale os apps obrigatórios

Para que a nova loja funcione, é preciso instalar os seguintes apps `vtex.store-sitemap` e `vtex.store`.

Rode  `vtex list`  para verificar se ambos já estão instalados. 

Caso não estejam, rode os seguintes comandos para instala-los: `vtex install vtex.store-sitemap vtex.store -f`

### Step 7 - Desinstalando qualquer tema pré-instalado

Rodando `vtex list`,  você pode verificar se existe algum tema já instalado.

È comum que já tenha o tema `vtex.store-theme`  instalado quando se inicia um novo processo de desenvolvimento. 

Dessa forma, se voce encontrar algum tema instalado, copie o nome para utilizar junto ao seguinte comando: `vtex uninstall`. por exemplo:

```json
vtex uninstall vtex.store-theme
```

### Step 9 - Execute e veja o preview da loja

Execute no terminal o comando vtex setup, para que os dados no package.json da pasta react sejam atualizados de acordo com o dados do novo ambiente.

Instale o app de wishlist `vtex install vtex.wishlist@1.x`

Acesse o painel do cliente, vá em Configurações da loja => INTELLIGENT SEARCH > Integrações, clique em INICIAR INTEGRAÇÃO e aguarde finalizar os itens 'Salvar dados da loja' e 'Ativar busca', o item 'Validar catálogo' levará mais tempo, então pode seguir para o próximo passo.

Agora é hora de ver o preview da loja em ambiente de homologação. Para isso volte ao terminal e utilize o comando `vtex link`. 

Se o processo tiver ocorrido com sucesso a seguinte mensagem será exibida: `App linked successfully`. Em uma nova aba do prompt de comando, execute `vtex browse` para que seja a loja seja aberta no navegador.

Com o tema linkado, qualquer nova alteração será refletida de modo ao vivo.

### Step 10 - Checkout personalizado

Para usar o checkout personalizado, entre em nosso [painel admin](https://agencianairuzpartnerbr.myvtex.com/admin/), navegue para: Configurações da loja => Checkout, na janela que abrir vá para a aba "Code", com isso basta ver os arquivos que foram alterados e copiar para o novo projeto.


## Componentes React

### Preço à vista com desconto
Criado componente na pasta Product/CashPrice para exibir o preço à vista com desconto no boleto ou pix, para que o componente funcione de forma correta é necessário no painel administrativo da loja criar a promoção de meio de pagamento para boleto ou pix com o nome da promoção contendo as palavras boleto ou pix, na regra da promoção em 'Destaque nos produtos:' marque a opção 'Com destaque'. Caso a promoção de meio de pagamento não for criada, o componente exibira o mesmo preço a vista do componente nativo.
Atualmente o componente exibe apenas um único valor de desconto, caso o requisto do cliente seja de ter x% de desconto para pix e x% de desconto para boleto, será necessário a personalização do componente caso queira exibir os dois valores de forma serapada.

### Instagram
Criado componente para exibir posts do instagram, para fazer a requisição para os posts do cliente a url da api deve ser alterada diretamente no componente, as variavéis de controle do componente são.:
apiUrl => url da api dos posts
instaProfile => url do perfil do insta, utilizado no logo no instragram
totalPostsToShow => números de posts a serem exibidos


### Descrição curta do produto
No cadastro do produto o campo principal de descrição do produto está sendo utilizado para a descrição curta, para a descrição curta foi criado um novo componente para exibir apenas esse campo e ter flexibilidade na personalização do conteúdo, componente esse presente na pasta react/components/Product/ShortDescription, lá encontramos o arquivo react e também seu css

### Descrições complementares do produto
Para prover novos campos de descrições para o produto, é necessário criar no painel um novo grupo de especificações para produto, seguindo a documentação [Cadastrar especificações ou campos de produto](https://help.vtex.com/pt/tutorial/cadastrar-especificacoes-ou-campos-de-produto--tutorials_106), configure o campo para ser exibido na aba especificações e utilize o tipo 'Texto Grande', o componente responsavél por exibir essas informações está na pasta react/components/Product/InfoTabs, lá encontramos o arquivo react e também seu css.
Obs.: Esse componente também recebe como children o app nativo de avaliações de produto da vtex, caso não seja configurado novos campos de descrições para o produto, apenas a aba com avaliações do produto será exibida.

### HeaderLogin
Componente criado para personalizar de forma fácil o texto presente no cabeçalho, quando não há cliente logado a frase exibida é "Entrar ou Cadastrar", já quando o cliente realiza login no site o texto é alterado para "Olá, Fulano".
