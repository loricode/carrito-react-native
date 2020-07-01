import 'react-native-gesture-handler';
import  React, {useState,useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View, Button} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';

const Stack = createStackNavigator();

function Home({ navigation }){

const [listaProducto, setListaProducto] = useState([]);
const [usuario, setUsuario] = useState('user1');

const  comprar = async(nombre,precio) => {
    const obj = {nombre, precio, usuario}
    const res = await axios.post('http://192.168.1.5/appCarrito/carrito.php',obj);    
    console.log(res)  
}   

useEffect(() => {
  async function getProductos()  {
    const res = await axios.get('http://192.168.1.5/appCarrito/listar.php');
    setListaProducto(res.data) 
}
     getProductos();
},[]);
 
  return(
  <View style={styles.container}>
      <Button
            color="#0EDA6A"
            title="ir al Carrito"
            onPress={() => navigation.navigate('Carrito') }>
        </Button>
      {listaProducto.map(producto => (
         <View key={producto.id} style={{margin:4}} >
                
            <Text style={styles.texto}>Nombre: {producto.nombre}</Text>
            <Text style={styles.texto}>Precio: {producto.precio}</Text> 
            <Button
                color="#1E5FF5"
                title="Comprar $"
                onPress={() => comprar(producto.nombre,producto.precio) }>
            </Button>
          </View>           
         ))}        
    </View>
  );
} 

function Carrito({navigation}){

  const [lista, setLista] = useState([]);
  const [total , setTotal] = useState(0)
  useEffect(() => {
    async function getCarrito()  {
      const res = await axios.get('http://192.168.1.5/appCarrito/listarcarrito.php');
      setLista(res.data) 
  }
       getCarrito();
  },[]);

const limpiarCarrito = async() => {
   await axios.get('http://192.168.1.5/appCarrito/eliminarcarrito.php'); 
   navigation.navigate('Home') 
}

  return(
    <View style={styles.containerCarrito}>
         {lista.map(producto => (
         <View key={producto.id} style={{margin:4}} >
             <Text style={styles.texto}>Nombre: {producto.nombre}</Text>
            <Text style={styles.texto}>Precio: {producto.precio}</Text>                 
           </View>           
         ))}
           <Button
                color="#DA0E49"
                title="Cancelar"
                onPress={() => limpiarCarrito() }>
            </Button>
            <Button
                color="#1E5FF5"
                title="Pagar"
                onPress={() =>console.log('pagar') }>
            </Button>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen  name="Home" component={Home} options={{title: 'Home'}} />
        <Stack.Screen name="Carrito" component={Carrito} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:2,  
    flexDirection: "column", 
    backgroundColor: '#fff',
   },
   texto:{
     fontSize:24,
     margin:5
   },
   containerCarrito: {
    flex:1,  
    flexDirection: "column", 
    backgroundColor: '#fff',
   },

});
