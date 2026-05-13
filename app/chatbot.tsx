import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView, Platform,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';

const GEMINI_API_KEY = 'AIzaSyDoW-S4yDvQf5YNADds5_4aWgUvGCKjilc';

type Message = { id: string; text: string; isBot: boolean };

export default function ChatBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: 'Hello! How can I support you today?', isBot: true },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const getGeminiResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }],
          }),
        }
      );
      const data = await response.json();
      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      return `Sorry, I cannot help right now. (Error ${response.status})`;
    } catch (e) {
      return `An error occurred: ${e}`;
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), text, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const reply = await getGeminiResponse(text);
    const botMsg: Message = { id: (Date.now() + 1).toString(), text: reply, isBot: true };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.bubble, item.isBot ? styles.botBubble : styles.userBubble]}>
      <Text style={[styles.bubbleText, item.isBot ? styles.botText : styles.userText]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      {loading && (
        <Text style={styles.thinking}>Bot is thinking...</Text>
      )}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Ionicons name="send" size={22} color="#FF69B4" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 8 },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  botBubble: { backgroundColor: '#f0f0f0', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: '#FF69B4', alignSelf: 'flex-end' },
  botText: { color: '#222' },
  userText: { color: '#fff' },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  thinking: { textAlign: 'center', color: '#888', fontSize: 13, paddingBottom: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 8,
  },
  sendBtn: { padding: 8 },
});
