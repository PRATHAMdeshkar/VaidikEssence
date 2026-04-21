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
import { theme } from "@/app/theme";

export default function ChatScreen() {
  const [question, setQuestion] = useState("");
  const insets = useSafeAreaInsets();
  const composerOffset = useRef(new Animated.Value(0)).current;

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

  const handleSubmit = () => {
    // Placeholder handler for future RAG integration.
    console.log("Submitted question:", question);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>RAG Chat (Template)</Text>
        <Text style={styles.subtitle}>This screen is a UI placeholder for upcoming RAG integration.</Text>

        <ScrollView
          style={styles.messagesArea}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        >
          <AppCard style={styles.dummyMessageCard}>
            <Text style={styles.messageLabel}>Dummy Response</Text>
            <Text style={styles.messageText}>
              Your retrieval-augmented answer will appear here after we connect the RAG pipeline.
            </Text>
          </AppCard>
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
          <AppButton title="Submit" onPress={handleSubmit} />
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
  dummyMessageCard: {
    gap: theme.spacing.xs,
  },
  messageLabel: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: theme.tracking.wide,
  },
  messageText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  composerWrapper: {
    margin: theme.spacing.md,
    marginTop: 0,
  },
  composerCard: {
    marginBottom: 0,
  },
  questionInput: {
    minHeight: 120,
  },
});
