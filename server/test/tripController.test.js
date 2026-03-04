const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const TripMock = dbMock.define('Trip',{
 id:1,
 destination:"Pokhara",
 days:3,
 price:"200"
});

const mockRes = ()=>{
 const res={}
 res.status=jest.fn().mockReturnValue(res)
 res.json=jest.fn().mockReturnValue(res)
 return res
}

const createTrip = async(req,res)=>{
 try{

  const {destination,days,price}=req.body

  if(!destination){
   return res.status(400).json({message:"Destination required"})
  }

  const trip = await TripMock.create({destination,days,price})

  res.status(201).json({success:true,data:trip})

 }catch(err){
  res.status(500).json({message:err.message})
 }
}

const getTrips = async(req,res)=>{
 try{

  const trips = await TripMock.findAll()

  res.status(200).json({success:true,data:trips})

 }catch(err){
  res.status(500).json({message:err.message})
 }
}

describe("Trip Controller Tests",()=>{

test("Case 25 create trip success",async()=>{
 const req={body:{destination:"Pokhara",days:3,price:"200"}}
 const res=mockRes()

 await createTrip(req,res)

 expect(res.status).toHaveBeenCalledWith(201)
})

test("Case 26 missing destination",async()=>{
 const req={body:{}}
 const res=mockRes()

 await createTrip(req,res)

 expect(res.status).toHaveBeenCalledWith(400)
})

test("Case 27 create called",async()=>{
 const req={body:{destination:"A"}}
 const res=mockRes()

 const spy=jest.spyOn(TripMock,'create')

 await createTrip(req,res)

 expect(spy).toHaveBeenCalled()
})

test("Case 28 json called",async()=>{
 const req={body:{destination:"A"}}
 const res=mockRes()

 await createTrip(req,res)

 expect(res.json).toHaveBeenCalled()
})

test("Case 29 get trips success",async()=>{
 const req={}
 const res=mockRes()

 await getTrips(req,res)

 expect(res.status).toHaveBeenCalledWith(200)
})

test("Case 30 findAll called",async()=>{
 const req={}
 const res=mockRes()

 const spy=jest.spyOn(TripMock,'findAll')

 await getTrips(req,res)

 expect(spy).toHaveBeenCalled()
})

test("Case 31 db error",async()=>{
 const req={}
 const res=mockRes()

 TripMock.findAll=jest.fn().mockRejectedValue(new Error())

 await getTrips(req,res)

 expect(res.status).toHaveBeenCalledWith(500)
})

test("Case 32 status called",async()=>{
 const req={}
 const res=mockRes()

 await getTrips(req,res)

 expect(res.status).toHaveBeenCalled()
})

})