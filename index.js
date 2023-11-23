const express = require('express')
const { v4: uuidv4 } = require('uuid');
const app = express() 
const port = 3000
const log = console.log;
app.use(express.json());

const orders = []

const checkUserid = (request, response, next) => {
  const { id } = request.params;

  const index = orders.findIndex((user) => user.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "User not found" });
  }

  request.userIndex = index;
  request.userId = id

  next()
};

//* ROTA
 //*!order 

//* cadastra pedido
// Rota POST /order
app.post('/order', (request, response) => {
  //* Dados da requisição do cliente
  const { order, clientName, price } = request.body;

  //* Verifica se todos os campos necessários estão presentes

  if (!order || !clientName || !price) {
    return response.status(400).json({ error: 'Pedido inválido. Certifique-se de fornecer order, clientName e price.' });
  }

  //*? Cria um novo pedido

  const newOrder = {
    id: uuidv4(),
    order,
    clientName,
    price,
   status:"Em preparação"
  };

  // Adiciona o novo pedido ao array
  orders.push(newOrder);

  return response.status(201).json({newOrder})
})

  //* pega pedidos cadastrados
  app.get("/order", (request,response) => {
    return response.json({orders});
  });

  
  
  //* Atualiza pedido
  app.put('/order/:id', checkUserid, (request, response) => {

    const { order, clientName, price } = request.body;
    const index = request.userIndex;
    const id = request.userId
    const updatedOrder = { id, order, clientName, price };
    orders[index] = updatedOrder;

  return response.json({ updatedOrder });
});



//* patch order ready

app.patch('/order/:id', checkUserid, (request, response) => {

  const { order, clientName, price } = request.body;
  const index = request.userIndex;
  const id = request.userId
  const updatedOrder = { id, order, clientName, price, status: "Pronto" };
  orders[index] = updatedOrder;
  return response.json({ updatedOrder });

  
})

  



//* iniciabdo o servidor 
app.listen(port, () => {
    log(`🚀Server started on port ${port}`)
})