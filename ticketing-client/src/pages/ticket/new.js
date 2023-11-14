import useRequest from '@/hooks/use-request';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const New = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price: parseFloat(price).toFixed(2) },
    onSuccess: () => router.push('/')
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  }

  return (
    <div className='container'>
      <form className='card' onSubmit={onSubmit}>
        <div className='card-body'>
          <h5 className="card-title mb-4">Create new ticket</h5>

          <div className='form-group mb-2'>
            <label className="form-label">Title</label>
            <input type="text" className='form-control'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Price</label>
            <input
              className='form-control'
              value={price}
              onBlur={e => setPrice(parseFloat(e.target.value))}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
        </div>
        {errors && <div className='p-2'>
          {errors}
        </div>}
        <div className='card-footer'>
          <button className='btn btn-primary'>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default New