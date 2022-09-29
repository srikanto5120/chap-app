import { io } from "socket.io-client";
import { apiSlice } from "../api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) =>
        `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,
      transformResponse(apiResponse, meta) {
        return {
          data: apiResponse,
          totalCount: meta.response.headers.get("X-Total-Count"),
        };
      },
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData, getState }
      ) {
        const receiverEmail = getState().auth?.user.email;

        // create socket
        const socket = io(process.env.REACT_APP_API_URL, {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttemps: 10,
          transports: ["websocket"],
          agent: false,
          upgrade: false,
          rejectUnauthorized: false,
        });

        try {
          await cacheDataLoaded;

          socket.on("messages", (data) => {
            updateCachedData((draft) => {
              if (data?.data?.receiver?.email === receiverEmail) {
                draft?.data?.unshift(data?.data);
              } else {
                //do nothing here
              }
            });
          });
        } catch (error) {
          await cacheEntryRemoved;
          socket.close();
        }
      },
    }),
    getMoreMessages: builder.query({
      query: ({ id, page }) =>
        `/messages?conversationId=${id}&_sort=timestamp&_order=asc&_page=${page}&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,
      async onQueryStarted({ id }, { queryFulfilled, dispatch }) {
        try {
          const messages = await queryFulfilled;

          if (messages?.data?.length) {
            // update get conversations cache pessimistically start
            dispatch(
              apiSlice.util.updateQueryData("getMessages", id, (draft) => {
                return {
                  data: [...draft.data, ...messages.data],
                  totalCount: Number(draft.totalCount),
                };
              })
            );
            // update messages cache pessimistically end
          }
        } catch (err) {}
      },
    }),
    addMessage: builder.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
