// Importa o StyleSheet do React Native para criar objetos de estilo otimizados.
import { StyleSheet } from 'react-native';

// Cria e exporta o objeto de estilos que será usado no App.js.
export const styles = StyleSheet.create({
  // --- Estilos da Tela Principal ---
  container: {
    flex: 1, // Faz o container principal ocupar toda a tela disponível.
    backgroundColor: '#f0f2f5', // Uma cor de fundo suave.
  },
  header: {
    flexDirection: 'row', // Alinha os itens (título e botão) horizontalmente.
    justifyContent: 'space-between', // Coloca um item no início e outro no fim.
    alignItems: 'center', // Alinha os itens verticalmente ao centro.
    padding: 20, // Espaçamento interno.
    borderBottomWidth: 1, // Linha de separação na parte inferior.
    borderBottomColor: '#ddd', // Cor da linha de separação.
    backgroundColor: 'white', // Cor de fundo do cabeçalho.
  },
  title: {
    fontSize: 22, // Tamanho da fonte do título.
    fontWeight: 'bold', // Deixa o texto em negrito.
  },
  listContainer: {
    padding: 20, // Adiciona espaçamento ao redor da lista para não colar nas bordas.
  },

  // --- Estilos do Card de Usuário na Lista ---
  userCard: {
    backgroundColor: 'white', // Cor de fundo do card.
    padding: 15, // Espaçamento interno.
    borderRadius: 8, // Bordas arredondadas.
    marginBottom: 15, // Espaçamento entre os cards.
    elevation: 3, // Adiciona uma sombra para Android.
    shadowColor: '#000', // Adiciona uma sombra para iOS (cor).
    shadowOffset: { width: 0, height: 1 }, // Posição da sombra.
    shadowOpacity: 0.2, // Opacidade da sombra.
    shadowRadius: 1.41, // Raio da sombra.
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Cor escura para o nome.
  },
  userEmail: {
    fontSize: 14,
    color: '#666', // Cor cinza para o email.
    marginTop: 2, // Pequeno espaçamento acima.
  },
   userPhone: {
    fontSize: 14,
    color: '#666', // Cor cinza para o telefone.
    marginTop: 2,
  },
  cardButtons: {
    flexDirection: 'row', // Alinha os ícones de editar/excluir horizontalmente.
    alignItems: 'center', // Alinha os ícones verticalmente.
    position: 'absolute', // Permite posicionar livremente dentro do pai (userCard).
    right: 15, // Posiciona 15 pixels da direita.
    top: 15, // Posiciona 15 pixels do topo.
  },
  
  // --- Estilos dos Modais ---
  modalBackdrop: {
    flex: 1, // Ocupa a tela toda.
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo preto semi-transparente.
    justifyContent: 'center', // Centraliza o conteúdo verticalmente.
    alignItems: 'center', // Centraliza o conteúdo horizontalmente.
  },
  modalView: {
    width: '90%', // O modal terá 90% da largura da tela.
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingTop: 40, // Mais espaço no topo para o botão 'X'.
    elevation: 10, // Sombra para o modal.
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
      alignSelf: 'flex-start', // Alinha o texto da label à esquerda.
      marginLeft: 5,
      marginBottom: 5,
      fontSize: 14,
      color: '#333',
  },
  input: {
    width: '100%', // Ocupa toda a largura do modal.
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15, // Espaçamento interno horizontal.
    marginBottom: 15, // Espaçamento abaixo do input.
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center', // Centraliza os botões de ação.
    width: '100%',
    marginTop: 20,
  },
  errorText: {
    color: 'red', // Cor do texto de erro.
    textAlign: 'center',
    marginBottom: 10,
  },
  modalCloseButton: {
    position: 'absolute', // Posição absoluta em relação ao pai (modalView).
    top: 15, // 15 pixels do topo.
    right: 15, // 15 pixels da direita.
  },
});