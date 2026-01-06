import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/posts?_limit=10", // Using posts instead of todos
      providesTags: ["Todos"],
      transformResponse: (response) => {
        // Transform posts to todo format
        return response.map((post) => ({
          id: post.id,
          title: post.title,
          description: post.body || "",
          completed: false,
          userId: post.userId,
        }));
      },
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: "/posts",
        method: "POST",
        body: {
          title: todo.title,
          body: todo.description || "",
          userId: 1,
        },
      }),
      transformResponse: (response) => ({
        id: response.id,
        title: response.title,
        description: response.body || "",
        completed: false,
        userId: response.userId,
      }),
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
            draft.unshift({
              id: Date.now(),
              title: todo.title,
              description: todo.description || "",
              completed: false,
              userId: 1,
            });
          })
        );
        try {
          const { data } = await queryFulfilled;
          // Update with actual ID from server
          dispatch(
            todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
              const index = draft.findIndex((t) => t.id === Date.now());
              if (index !== -1) {
                draft[index] = data;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Todos"],
    }),
    updateTodo: builder.mutation({
      query: ({ id, ...todo }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: {
          id,
          title: todo.title,
          body: todo.description || "",
          userId: todo.userId || 1,
        },
      }),
      transformResponse: (response) => ({
        id: response.id,
        title: response.title,
        description: response.body || "",
        completed:
          response.completed !== undefined ? response.completed : false,
        userId: response.userId,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const todo = draft.find((t) => t.id === id);
            if (todo) {
              Object.assign(todo, patch);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todosApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const index = draft.findIndex((t) => t.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Todos"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
