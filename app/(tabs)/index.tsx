import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPosts } from "../../services/api";

export default function Index() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = () => {
    getPosts()
      .then((res) => {
        if (res.status === 200) {
          setPosts(res.data);
        } else {
          console.log("error");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title="Add New Post" onPress={() => router.push("/addPost")} />
      </View>

      <ScrollView>
        {posts.map((post) => (
          <Pressable
            key={post.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/postDetail",
                params: {
                  id: post.id,
                  userId: post.userId,
                },
              })
            }
          >
            <Text style={styles.boldText}>Post Number: {post.id}</Text>
            <Text style={styles.boldText}>Title: {post.title}</Text>
            <Text>Body: {post.body}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { padding: 15, backgroundColor: "white", elevation: 2 },
  card: {
    padding: 15,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 1,
  },
  boldText: { fontWeight: "bold", marginBottom: 5 },
});
