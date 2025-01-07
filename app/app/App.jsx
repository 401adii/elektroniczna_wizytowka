import "../global.css"
import { SafeAreaView } from "react-native";
import Input from "./Input";
import Permission from "./Permission";
import Test from "./Test";

export default function App() {
  
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
        {/* <Input/>
        <Permission/> */}
        <Test/>
    </SafeAreaView>
  );
}


