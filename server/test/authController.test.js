const SequelizeMock = require('sequelize-mock');
const bcrypt = require('bcryptjs');

const dbMock = new SequelizeMock();

const UserMock = dbMock.define('User',{
 id:1,
 name:"John",
 email:"john@test.com",
 password:"hashed"
});

const mockRes = () =>{
 const res={}
 res.status=jest.fn().mockReturnValue(res)
 res.json=jest.fn().mockReturnValue(res)
 return res
}

const register = async(req,res)=>{
 try{

  const {name,email,password} = req.body

  if(!name || !email || !password){
   return res.status(400).json({message:"fields required"})
  }

  const existing = await UserMock.findOne({where:{email}})

  if(existing){
   return res.status(409).json({message:"email exists"})
  }

  const hashed = await bcrypt.hash(password,10)

  const user = await UserMock.create({name,email,password:hashed})

  res.status(201).json({success:true,data:user})

 }catch(err){
  res.status(500).json({message:err.message})
 }
}

describe("Auth Controller Tests",()=>{

test("Case 1: register success",async()=>{
 const req={body:{name:"a",email:"a@a.com",password:"123"}}
 const res=mockRes()

 UserMock.findOne=jest.fn().mockResolvedValue(null)

 await register(req,res)

 expect(res.status).toHaveBeenCalledWith(201)
})

test("Case 2: missing fields",async()=>{
 const req={body:{email:"a"}}
 const res=mockRes()

 await register(req,res)

 expect(res.status).toHaveBeenCalledWith(400)
})

test("Case 3: email exists",async()=>{
 const req={body:{name:"a",email:"a",password:"123"}}
 const res=mockRes()

 UserMock.findOne=jest.fn().mockResolvedValue({id:1})

 await register(req,res)

 expect(res.status).toHaveBeenCalledWith(409)
})

test("Case 4: db error",async()=>{
 const req={body:{name:"a",email:"a",password:"123"}}
 const res=mockRes()

 UserMock.findOne=jest.fn().mockRejectedValue(new Error())

 await register(req,res)

 expect(res.status).toHaveBeenCalledWith(500)
})

test("Case 5: bcrypt hashing called",async()=>{
 const req={body:{name:"a",email:"a",password:"123"}}
 const res=mockRes()

 UserMock.findOne=jest.fn().mockResolvedValue(null)

 const spy=jest.spyOn(bcrypt,'hash').mockResolvedValue("hashed")

 await register(req,res)

 expect(spy).toHaveBeenCalled()
})

test("Case 6: user creation",async()=>{
 const req={body:{name:"a",email:"a",password:"123"}}
 const res=mockRes()

 UserMock.findOne=jest.fn().mockResolvedValue(null)

 const spy=jest.spyOn(UserMock,'create')

 await register(req,res)

 expect(spy).toHaveBeenCalled()
})

test("Case 7: response json called",async()=>{
 const req={body:{name:"a",email:"a",password:"123"}}
 const res=mockRes()

 UserMock.findOne=jest.fn().mockResolvedValue(null)

 await register(req,res)

 expect(res.json).toHaveBeenCalled()
})

test("Case 8: response status called",async()=>{
 const req={body:{name:"a",email:"a",password:"123"}}
 const res=mockRes()

 UserMock.findOne=jest.fn().mockResolvedValue(null)

 await register(req,res)

 expect(res.status).toHaveBeenCalled()
})

})