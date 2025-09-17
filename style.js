// style.js

// Importa o StyleSheet do React Native, que otimiza a criação de estilos.
import { StyleSheet } from 'react-native';

// Cria e exporta o objeto de estilos para ser usado em outros arquivos.
export const styles = StyleSheet.create({
  // --- Estilos da Tela Principal e Estrutura ---
  container: {
    flex: 1, // Faz o container ocupar toda a tela.
    backgroundColor: '#f0f2f5', // Cor de fundo suave.
  },
  header: {
    flexDirection: 'row', // Alinha os itens (título e botão) na horizontal.
    justifyContent: 'space-between', // Espaça os itens, um em cada ponta.
    alignItems: 'center', // Centraliza os itens verticalmente.
    padding: 20, // Espaçamento interno.
    borderBottomWidth: 1, // Linha de separação inferior.
    borderBottomColor: '#ddd', // Cor da linha.
    backgroundColor: 'white', // Fundo branco para o cabeçalho.
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20, // Espaçamento para o conteúdo da lista.
  },

  // --- Estilos do Card de Usuário na Lista ---
  userCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8, // Bordas arredondadas.
    marginBottom: 15, // Espaço entre um card e outro.
    elevation: 3, // Sombra para Android.
    shadowColor: '#000', // Sombra para iOS.
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cardButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute', // Permite posicionar os ícones sobre o card.
    right: 15, // 15 pixels da borda direita.
    top: 15, // 15 pixels do topo.
  },
  
  // --- Estilos para os Modais (Pop-ups) ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente.
    justifyContent: 'center', // Centraliza o modal na vertical.
    alignItems: 'center', // Centraliza o modal na horizontal.
  },
  modalView: {
    width: '90%', // Largura do modal.
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingTop: 50, // Mais espaço no topo para o botão 'X'.
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start', // Alinha a label à esquerda.
    marginLeft: 5,
    marginBottom: 5,
    fontSize: 14,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Espaça os botões dentro do modal.
    width: '100%',
    marginTop: 20,
  },
  errorText: {
    color: 'red', // Cor para mensagens de erro.
    textAlign: 'center',
    marginBottom: 10,
  },
  modalCloseButton: {
    position: 'absolute', // Posicionamento absoluto em relação ao modalView.
    top: 15,
    right: 15,
  },
});