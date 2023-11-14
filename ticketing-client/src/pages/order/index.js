import axios from 'axios'
import React from 'react'

const Orders = ({ orders }) => {
  console.log(orders)

  return (
    <div className='container'>
      <div className='card'>
        <h5 className="card-title card-body">Orders</h5>
        <div>
          <ul className="list-group list-group-flush">
            {orders?.map(order => {
              return <li className="list-group-item" key={order.id}>{order.ticket.title} - {order.status}</li>
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const res = await axios.get(`http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/orders`, {
    headers: context.req.headers
  })
  console.log(res)
  return {
    props: {
      orders: res.data
    }
  }
}

export default Orders