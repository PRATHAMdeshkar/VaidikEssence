import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/app/components/ui/AppButton";
import { AppCard } from "@/app/components/ui/AppCard";
import { AppInput } from "@/app/components/ui/AppInput";
import { askQuestion, ChatReference } from "@/app/services/chatService";
import { theme } from "@/app/theme";

type MessageRole = "user" | "assistant";

interface ChatMessage {
  role: MessageRole;
  content: string;
  references?: ChatReference[];
}

export default function ChatScreen() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const composerOffset = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      const keyboardHeight = Math.max(0, event.endCoordinates.height - insets.bottom);

      Animated.timing(composerOffset, {
        toValue: keyboardHeight,
        duration: Platform.OS === "ios" ? event.duration ?? 250 : 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (event) => {
      Animated.timing(composerOffset, {
        toValue: 0,
        duration: Platform.OS === "ios" ? event.duration ?? 250 : 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [composerOffset, insets.bottom]);

  const handleSubmit = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: trimmedQuestion }]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await askQuestion(trimmedQuestion);
      const hasReferences = response.references && response.references.length > 0;
      const assistantContent = response.message?.trim()
        ? response.message
        : hasReferences
          ? "Here are relevant chapters:"
          : "I could not generate a response right now.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantContent,
          references: response.references ?? [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I could not reach the AI service right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* <Text style={styles.title}>RAG Chat (Template)</Text>
        <Text style={styles.subtitle}>This screen is a UI placeholder for upcoming RAG integration.</Text> */}

        <ScrollView
          ref={scrollRef}
          style={styles.messagesArea}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <AppCard style={styles.emptyStateCard}>
              <Text style={styles.messageLabel}>Ready</Text>
              <Text style={styles.messageText}>Ask anything to start the RAG chat.</Text>
            </AppCard>
          ) : (
            messages.map((message, index) => (
              <View
                key={`${message.role}-${index}`}
                style={[
                  styles.messageRow,
                  message.role === "user" ? styles.userMessageRow : styles.assistantMessageRow,
                ]}
              >
                <AppCard
                  style={[
                    styles.messageCard,
                    message.role === "user" ? styles.userMessageCard : styles.assistantMessageCard,
                  ]}
                >
                  <Text style={styles.messageText}>{message.content}</Text>
                  {message.role === "assistant" &&
                    message.references &&
                    message.references.length > 0 && (
                      <View style={styles.referenceWrapper}>
                        {message.references.map((reference, refIndex) => (
                          <View key={`ref-${index}-${refIndex}`} style={styles.referenceCard}>
                            <Text style={styles.referenceChapterTitle}>
                              Chapter {reference.chapter} - {reference.topic || "General"}
                            </Text>
                            <Text style={styles.referenceBody}>{reference.text}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                </AppCard>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <Animated.View
        style={[
          styles.composerWrapper,
          {
            transform: [{ translateY: Animated.multiply(composerOffset, -1) }],
          },
        ]}
      >
        <AppCard style={styles.composerCard}>
          <AppInput
            label="Ask a question"
            value={question}
            onChangeText={setQuestion}
            placeholder="Type your question for the knowledge base..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.questionInput}
          />
          <AppButton title="Submit" onPress={handleSubmit} loading={isLoading} disabled={!question.trim()} />
        </AppCard>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  title: {
    ...theme.typography.heading,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  messagesArea: {
    flex: 1,
    marginTop: theme.spacing.md,
  },
  messagesContent: {
    paddingBottom: theme.spacing.md,
  },
  emptyStateCard: {
    gap: theme.spacing.xs,
  },
  messageLabel: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: theme.tracking.wide,
  },
  messageRow: {
    width: "100%",
    marginBottom: theme.spacing.sm,
  },
  assistantMessageRow: {
    alignItems: "flex-start",
  },
  userMessageRow: {
    alignItems: "flex-end",
  },
  messageCard: {
    maxWidth: "84%",
  },
  assistantMessageCard: {
    backgroundColor: theme.colors.surface,
  },
  userMessageCard: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  messageText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  referenceWrapper: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  referenceCard: {
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.spacing.sm,
    borderRadius: 6,
    marginTop: theme.spacing.xs,
  },
  referenceChapterTitle: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  referenceBody: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  composerWrapper: {
    margin: theme.spacing.md,
    marginTop: 0,
  },
  composerCard: {
    marginBottom: 0,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  questionInput: {
    minHeight: 60,
    maxHeight: 120, // prevents it from growing too much
    fontSize: 16,
    paddingVertical: 8,

  },
});
