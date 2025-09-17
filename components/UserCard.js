// components/UserCard.js

// Importa bibliotecas e componentes essenciais.
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
// Importa os estilos do nosso arquivo centralizado.
import { styles } from '../style'; 

/**
 * Componente para exibir as informações de um único usuário.
 * É um componente de apresentação, sem lógica de negócio.
 * @param {object} user - Objeto do usuário (ex: { id, nome, email, telefone }).
 * @param {function} onEdit - Função a ser executada ao clicar no ícone de editar.
 * @param {function} onDelete - Função a ser executada ao clicar no ícone de deletar.
 */
const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    // Container principal do card.
    <View style={styles.userCard}>
      {/* Seção com as informações de texto do usuário. */}
      <View>
        <Text style={styles.userName}>{user.nome}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userPhone}>{user.telefone}</Text>
      </View>

      {/* Seção com os ícones de ação. */}
      <View style={styles.cardButtons}>
        {/* Ícone de Editar: TouchableOpacity o torna clicável. */}
        <TouchableOpacity onPress={onEdit} style={{ marginRight: 15 }}>
          <Feather name="edit-2" size={22} color="#007bff" />
        </TouchableOpacity>
        {/* Ícone de Deletar: TouchableOpacity o torna clicável. */}
        <TouchableOpacity onPress={onDelete}>
          <Feather name="trash-2" size={22} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Exporta o componente para que o App.js possa importá-lo.
export default UserCard;