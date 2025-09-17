// App.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  Modal, Alert, SafeAreaView, Button
} from 'react-native';

// Importações dos nossos módulos customizados
import * as Database from './db/database';
import UserCard from './components/UserCard';
import { styles } from './style';

// Importação de ícones
import { Feather } from '@expo/vector-icons';

// Componente principal que renderiza a aplicação.
export default function App() {
  // --- DEFINIÇÃO DOS ESTADOS ---
  const [db, setDb] = useState(null); // Armazena a conexão com o banco de dados.
  const [users, setUsers] = useState([]); // Lista de usuários para a FlatList.
  
  // Estados para o Modal Principal (Criar/Editar Usuário)
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Para a confirmação na criação

  // Estados para o Modal de Alteração de Senha
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Estados de Controle (modo edição, usuário atual, erros)
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [passwordError, setPasswordError] = useState('');

  // --- FUNÇÕES AUXILIARES DE VALIDAÇÃO E FORMATAÇÃO ---
  const isValidEmail = (emailToValidate) => /\S+@\S+\.\S+/.test(emailToValidate);

  const formatPhoneNumber = (text) => {
    const cleaned = ('' + text).replace(/\D/g, '');
    const len = cleaned.length;
    if (len >= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    if (len === 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    if (len === 9) return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}`;
    if (len === 8) return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`;
    return cleaned;
  };

  // --- LÓGICA DE INICIALIZAÇÃO E BANCO DE DADOS ---
  useEffect(() => {
    // Função auto-executável para podermos usar async/await dentro do useEffect.
    const setup = async () => {
      try {
        const database = await Database.initDb(); // Inicializa o banco.
        setDb(database); // Armazena a conexão no estado.
        await fetchUsers(database); // Busca os dados iniciais.
      } catch (error) {
        console.log('Erro ao inicializar o banco:', error);
      }
    };
    setup();
  }, []); // O array vazio `[]` garante que isso rode apenas uma vez.

  // Busca os usuários do banco e atualiza o estado da lista.
  const fetchUsers = async (database = db) => {
    if (!database) return; // Proteção para caso o banco não esteja pronto.
    try {
      const data = await Database.fetchAllUsers(database);
      setUsers(data);
    } catch (error) {
      console.log('Erro ao buscar usuários:', error);
    }
  };

  // --- FUNÇÕES DE MANIPULAÇÃO DE DADOS (HANDLERS) ---
  
  // Salva um usuário (novo ou editado).
  const handleSaveUser = async () => {
    if (!db) return;
    if (!nome || !email || !isValidEmail(email)) {
      return Alert.alert('Entrada Inválida', 'Por favor, preencha o nome e um email válido.');
    }

    try {
      if (isEditing) {
        await Database.updateUser(db, currentUser.id, nome, email, telefone);
      } else {
        if (!password || password !== confirmPassword) {
          return Alert.alert('Senha Inválida', 'As senhas não coincidem ou estão em branco.');
        }
        await Database.addUser(db, nome, email, telefone, password);
      }
      resetForms();
      await fetchUsers(); // Atualiza a lista na tela.
    } catch (error) {
      Alert.alert('Erro ao Salvar', 'Não foi possível salvar. O email já pode estar em uso.');
    }
  };

  // Deleta um usuário após confirmação.
  const handleDelete = (id) => {
    Alert.alert('Confirmar Exclusão', 'Tem certeza que deseja excluir este usuário?', [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive',
        onPress: async () => {
          if (!db) return;
          await Database.deleteUser(db, id);
          await fetchUsers();
        },
      },
    ]);
  };

  // Lida com a atualização da senha no modal específico.
  const handleUpdatePassword = async () => {
      if (!db) return;
      const userFromDb = await Database.fetchUserById(db, currentUser.id);

      if (userFromDb.password !== oldPassword) return setPasswordError('A senha antiga está incorreta.');
      if (!newPassword || newPassword !== confirmNewPassword) return setPasswordError('As novas senhas não coincidem ou estão em branco.');

      await Database.updateUserPassword(db, currentUser.id, newPassword);
      Alert.alert('Sucesso', 'Senha alterada!');
      resetForms();
  };

  // --- Funções de controle da UI (abrir/fechar modais, etc) ---
  const handleEdit = (user) => {
    setIsEditing(true); setCurrentUser(user);
    setNome(user.nome); setEmail(user.email); setTelefone(user.telefone);
    setIsUserModalVisible(true);
  };

  const handleAddNew = () => {
    resetForms();
    setIsEditing(false);
    setIsUserModalVisible(true);
  };
  
  const handleOpenPasswordModal = () => setIsPasswordModalVisible(true);

  // Reseta TODOS os formulários e estados relacionados para o padrão.
  const resetForms = () => {
    setNome(''); setEmail(''); setTelefone(''); setPassword(''); setConfirmPassword('');
    setOldPassword(''); setNewPassword(''); setConfirmNewPassword(''); setPasswordError('');
    setIsEditing(false); setCurrentUser(null);
    setIsUserModalVisible(false); setIsPasswordModalVisible(false);
  };
  
  // --- RENDERIZAÇÃO DA INTERFACE (JSX) ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usuários (SQLite)</Text>
        <Button title="Adicionar" onPress={handleAddNew} />
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <UserCard user={item} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
        )}
        contentContainerStyle={styles.listContainer}
      />
      
      {/* Modal Principal: Criar/Editar Usuário */}
      <Modal visible={isUserModalVisible} animationType="slide" transparent={true} onRequestClose={resetForms}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={resetForms}><Feather name="x" size={24} color="#333" /></TouchableOpacity>
            <Text style={styles.modalTitle}>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</Text>
            
            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} />
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
            <Text style={styles.label}>Telefone</Text>
            <TextInput style={styles.input} value={telefone} onChangeText={(text) => setTelefone(formatPhoneNumber(text))} keyboardType="phone-pad" maxLength={15}/>
            
            {!isEditing ? (
              <>
                <Text style={styles.label}>Senha</Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
              </>
            ) : (
              <View style={{marginTop: 10, width: '100%'}}>
                <Button title="Mudar Senha" onPress={handleOpenPasswordModal} color="#6c757d" />
              </View>
            )}
            
            <View style={styles.modalButtonRow}><Button title="Salvar" onPress={handleSaveUser} /></View>
          </View>
        </View>
      </Modal>

      {/* Modal Secundário: Alterar Senha */}
      <Modal visible={isPasswordModalVisible} animationType="fade" transparent={true} onRequestClose={resetForms}>
        <View style={styles.modalBackdrop}>
            <View style={styles.modalView}>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsPasswordModalVisible(false)}><Feather name="x" size={24} color="#333" /></TouchableOpacity>
                <Text style={styles.modalTitle}>Alterar Senha</Text>
                <TextInput style={styles.input} value={oldPassword} onChangeText={setOldPassword} placeholder="Senha Antiga" secureTextEntry />
                <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="Nova Senha" secureTextEntry />
                <TextInput style={styles.input} value={confirmNewPassword} onChangeText={setConfirmNewPassword} placeholder="Confirmar Nova Senha" secureTextEntry />

                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                
                <View style={styles.modalButtonRow}>
                  <Button title="Confirmar" onPress={handleUpdatePassword} />
                </View>
            </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}