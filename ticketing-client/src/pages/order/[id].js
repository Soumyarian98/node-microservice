import React from 'react'
import axios from 'axios'
import useRequest from '@/hooks/use-request';
import Timer from '@/components/timer';
import StripeCheckout from 'react-stripe-checkout';
import { useRouter } from 'next/router';


const OrderDetails = ({ order, currentUser }) => {
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: (o) => router.push('/order')
  });


  return (
    <div className='container'>
      <div className='card'>
        <div className='card-body'>
          <h5 className="card-title">{order.ticket.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Price: {order.ticket.price}</h6>
          <h6 className="card-subtitle mb-2 text-muted">Status: {order.status}</h6>
        </div>
        <div className='card-footer'>
          {new Date(order.expiresAt) > new Date ? <div>
            <Timer expiration={
              order.expiresAt
            } />
            <StripeCheckout
              token={(t) => {
                doRequest({ token: t.id })
              }}
              stripeKey="pk_test_51I99VZLQ8caqWithxihd8KhUV1vhBFMkcB56FoDb3NyOLRNZC3SnziufC7R2Lhr3K5vipS19Ltgiu0wUTkSBJLX200WavIaGCO"
              email={currentUser.email}
              amount={order.ticket.price * 100}
            />
            {errors && <div className='p-2'>
              {errors}
            </div>}
          </div> :
            <div className='text-danger'>
              This order has expired
            </div>
          }
        </div>

      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const res = await axios.get(`http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/orders/${context.params.id}`, {
    headers: context.req.headers
  })
  return {
    props: {
      order: res.data
    }
  }
}

export default OrderDetails