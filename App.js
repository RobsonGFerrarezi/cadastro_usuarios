// App.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  Modal, Alert, SafeAreaView, Button
} from 'react-native';

import * as Database from './db/database';
import UserCard from './components/UserCard';
import { styles } from './style';
import { Feather } from '@expo/vector-icons';

export default function App() {
  // --- DEFINIÇÃO DOS ESTADOS ---
  const [db, setDb] = useState(null);
  const [users, setUsers] = useState([]);
  
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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

  // Função centralizada para validar a complexidade da senha.
  const isPasswordValid = (pass) => {
    // Testa cada regra e retorna true apenas se todas passarem.
    const hasMinLength = pass.length >= 5;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    return hasMinLength && hasUpperCase && hasNumber;
  };


  // --- LÓGICA DE INICIALIZAÇÃO E BANCO DE DADOS ---
  useEffect(() => {
    const setup = async () => {
      try {
        const database = await Database.initDb();
        setDb(database);
        await fetchUsers(database);
      } catch (error) {
        console.log('Erro ao inicializar o banco:', error);
      }
    };
    setup();
  }, []);

  const fetchUsers = async (database = db) => {
    if (!database) return;
    try {
      const data = await Database.fetchAllUsers(database);
      setUsers(data);
    } catch (error) {
      console.log('Erro ao buscar usuários:', error);
    }
  };


  // --- FUNÇÕES DE MANIPULAÇÃO DE DADOS (HANDLERS) ---
  
  // A lógica de salvar agora inclui a nova validação de senha.
  const handleSaveUser = async () => {
    if (!db) return;
    if (!nome || !email || !isValidEmail(email)) {
      return Alert.alert('Entrada Inválida', 'Por favor, preencha o nome e um email válido.');
    }

    try {
      if (isEditing) {
        await Database.updateUser(db, currentUser.id, nome, email, telefone);
      } else {
        // Bloco de validação de senha para novos usuários
        if (password !== confirmPassword) {
            // Define o erro no estado para ser exibido no modal
            setPasswordError('As senhas não coincidem.');
            return;
        }
        if (!isPasswordValid(password)) {
            // Define o erro com todas as regras para o usuário ver
            setPasswordError('A senha deve ter no mínimo 5 caracteres, uma letra maiúscula e um número.');
            return;
        }
        // Se a validação passar, limpa qualquer erro antigo
        setPasswordError('');
        await Database.addUser(db, nome, email, telefone, password);
      }
      resetForms();
      await fetchUsers();
    } catch (error) {
      Alert.alert('Erro ao Salvar', 'Não foi possível salvar. O email já pode estar em uso.');
    }
  };

  // ... função handleDelete sem alterações ...
  const handleDelete = (id) => {
    Alert.alert('Confirmar Exclusão', 'Tem certeza?', [
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

  //  A lógica de atualizar senha agora inclui a nova validação.
  const handleUpdatePassword = async () => {
      if (!db) return;
      const userFromDb = await Database.fetchUserById(db, currentUser.id);

      if (userFromDb.password !== oldPassword) {
        return setPasswordError('A senha antiga está incorreta.');
      }
      if (newPassword !== confirmNewPassword) {
        return setPasswordError('As novas senhas não coincidem.');
      }
      if (!isPasswordValid(newPassword)) {
        return setPasswordError('A nova senha deve ter no mínimo 5 caracteres, uma letra maiúscula e um número.');
      }

      // Se tudo estiver certo, limpa o erro e atualiza
      setPasswordError('');
      await Database.updateUserPassword(db, currentUser.id, newPassword);
      Alert.alert('Sucesso', 'Senha alterada!');
      resetForms();
  };

  // --- Funções de controle da UI (sem alterações) ---
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
  
  const handleOpenPasswordModal = () => {
      setPasswordError(''); // Limpa erros antigos antes de abrir
      setIsPasswordModalVisible(true);
  };

  const resetForms = () => {
    setNome(''); setEmail(''); setTelefone(''); setPassword(''); setConfirmPassword('');
    setOldPassword(''); setNewPassword(''); setConfirmNewPassword(''); setPasswordError('');
    setIsEditing(false); setCurrentUser(null);
    setIsUserModalVisible(false); setIsPasswordModalVisible(false);
  };
  
  // --- RENDERIZAÇÃO DA INTERFACE (JSX) ---
  return (
    <SafeAreaView style={styles.container}>
      {/* ...Header e FlatList sem alterações... */}
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

                {/* Exibe o erro de senha diretamente no formulário */}
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => {setIsPasswordModalVisible(false); setPasswordError('');}}>
                    <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Alterar Senha</Text>
                <TextInput style={styles.input} value={oldPassword} onChangeText={setOldPassword} placeholder="Senha Antiga" secureTextEntry />
                <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="Nova Senha" secureTextEntry />
                <TextInput style={styles.input} value={confirmNewPassword} onChangeText={setConfirmNewPassword} placeholder="Confirmar Nova Senha" secureTextEntry />

                {/* Exibe o erro de senha diretamente no formulário */}
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