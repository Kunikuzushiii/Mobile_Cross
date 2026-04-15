import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getComments, getPostDetail, getUserDetail } from "../services/api";

export default function PostDetail() {
  const { id, userId } = useLocalSearchParams<{ id: string; userId: string }>();

  const [user, setUser] = useState<any>(null);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      getPostDetailData();
      getUserData();
      getCommentsData();
    }
  }, [id, userId]);

  const getUserData = () => {
    getUserDetail(Number(userId))
      .then((res) => {
        if (res.status === 200) setUser(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getPostDetailData = () => {
    getPostDetail(Number(id))
      .then((res) => {
        if (res.status === 200) setPost(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getCommentsData = () => {
    getComments(Number(id))
      .then((res) => {
        if (res.status === 200) setComments(res.data);
      })
      .catch((err) => console.log(err));
  };

  if (!post) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postSection}>
        <Text style={styles.title}>{post?.title}</Text>
        <Text style={styles.body}>{post?.body}</Text>

        <View style={styles.authorSection}>
          <Text style={{ fontWeight: "bold" }}>Post Created By:</Text>
          <Text>Name: {user?.name}</Text>
          <Text>Email: {user?.email}</Text>
        </View>
      </View>

      <View style={styles.commentSection}>
        <Text style={styles.commentHeader}>Comments ({comments.length})</Text>
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentCard}>
            <Text style={styles.commentEmail}>{comment.email}</Text>
            <Text style={styles.commentName}>{comment.name}</Text>
            <Text>{comment.body}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  postSection: { padding: 20, backgroundColor: "white", marginBottom: 10 },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  body: { textAlign: "center", marginBottom: 20, fontStyle: "italic" },
  authorSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#eef",
    borderRadius: 8,
  },
  commentSection: { padding: 15 },
  commentHeader: { fontWeight: "bold", fontSize: 16, marginBottom: 10 },
  commentCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentEmail: { fontWeight: "bold", color: "#555" },
  commentName: { fontWeight: "bold", marginBottom: 5, fontSize: 12 },
});
