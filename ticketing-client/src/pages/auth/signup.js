import { useState } from 'react';
import { useRouter } from "next/router"
import useRequest from '@/hooks/use-request';


const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => router.push('/')
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    doRequest();
  }

  return (
    <div className='container'>
      <form className='card' onSubmit={onSubmit}>
        <div className='card-body'>
          <h5 className="card-title mb-4">Sign Up</h5>

          <div className='form-group mb-2'>
            <label className="form-label">Email Id</label>
            <input type="text" placeholder="test@test.com" className='form-control'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Password</label>
            <input
              type="password" placeholder="Password" className='form-control'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>
        {errors}
        <div className='card-footer'>
          <button className='btn btn-primary'>Sign Up</button>
        </div>
      </form>
    </div>
  )
}

export default SignUp