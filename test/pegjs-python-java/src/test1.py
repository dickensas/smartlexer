class Person:  
           
  def __init__(self, name, age):  
    self.name = name
    self.age = age
  def hello(self):
    print("hello")
    a = 33
    b = 200
    if b > a:
      print("b is greater than a")
    elif b == 150:
      print("2 - Got a true expression value")
      print(b)
    else :
      print("b is greater than a")
  class Person2:  
    def hello(self):
      print("aa")
      for x in range(0, 3):
        print("We're on time %d")

p1 = Person("John", 36)

print(p1.name)  
print(p1.age)  
print(p1.hello())
