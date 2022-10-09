import Head from "next/head"
import Headerr from "../components/Head"


export default function Home() {

    return (
        <div>
            <Head>
                <title>BuyMeACoffee</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Headerr />
        </div>
    )
}