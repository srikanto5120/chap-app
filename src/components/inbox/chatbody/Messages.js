import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import Message from "./Message";

export default function Messages({ messages = [], fetchData2, hasMore }) {
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};

  return (
    <div className="relative w-full h-[calc(100vh_-_150px)] p-6   flex flex-col-reverse">
      <ul className="space-y-2">
        <InfiniteScroll
          dataLength={messages?.length}
          next={fetchData2}
          hasMore={hasMore}
          height={window.innerHeight - 200}
          loader={<h4>Loading...</h4>}
          style={{ display: "flex", flexDirection: "column-reverse" }}
          inverse={true} //
          scrollableTarget="scrollableDiv"
        >
          {messages.map((message) => {
            const { message: lastMessage, id, sender } = message || {};

            const justify = sender.email !== email ? "start" : "end";

            return <Message key={id} justify={justify} message={lastMessage} />;
          })}
        </InfiniteScroll>
      </ul>
    </div>
  );
}
