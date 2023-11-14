import buildClient from "@/api/build-client";
import "bootstrap/dist/css/bootstrap.min.css"
import Header from "@/components/header";

function AppComponent({ Component, pageProps, currentUser }) {
  return <div>
    <Header currentUser={currentUser} />
    <Component {...pageProps} currentUser={currentUser} />
  </div>
}

AppComponent.getInitialProps = async (appContext) => {
  const client = await buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  return {
    pageProps: {},
    ...data
  };
}

export default AppComponent;