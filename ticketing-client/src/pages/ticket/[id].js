import React from 'react'
import axios from 'axios'
import useRequest from '@/hooks/use-request';
import { useRouter } from 'next/router';

const TicketDetails = ({ ticket }) => {
  const router = useRouter()
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (o) => router.push(`/order/${o.id}`)
  });


  return (
    <div className='container'>
      <div className='card'>
        <div className='card-body'>
          <h5 className="card-title">{ticket.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Price: {ticket.price}</h6>
        </div>
        {errors && <div className='p-2'>
          {errors}
        </div>}
        <div className='card-footer'>
          <button onClick={() => doRequest({})} className='btn btn-primary btn-sm'>Purchase</button>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  console.log(context)
  const res = await axios.get(`http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets/${context.params.id}`, {
    headers: context.req.headers
  })
  return {
    props: {
      ticket: res.data
    }
  }
}

export default TicketDetails