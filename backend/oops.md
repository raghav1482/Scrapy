### 1. Classes and Objects

**Classes:**
- A class is a blueprint for creating objects.
- It defines a type by bundling data (attributes) and methods (functions) that operate on the data into one single unit.

**Objects:**
- An object is an instance of a class.
- It has specific values for the attributes and can use the methods defined in the class.

**Relationship:**
- A class defines the structure and behavior that the objects created from the class will have.
- Objects are concrete instances that hold specific values and can perform actions defined by the class.

### 2. Null in Java

**Null:**
- Represents the absence of a value or an uninitialized object reference.
- Used to indicate that a variable does not point to any object or has not been assigned a value.

**Necessity:**
- Allows for the differentiation between a variable that points to an object and one that does not.
- Important for error handling and avoiding dereferencing null pointers.

### 3. Parts of a Simple Empty Class

1. **Class Declaration:**
   ```java
   public class MyClass {}
   ```
   - This declares a class named `MyClass`.

2. **Constructor (optional in an empty class):**
   - If not explicitly defined, Java provides a default constructor.
   
3. **Class Body:**
   - The block where fields (attributes) and methods (functions) would be defined, even if empty in this case.
   ```java
   public class MyClass {
       // Empty body
   }
   ```

### 4. Constructor

**Constructor:**
- A special method that is called when an object is instantiated.
- Has the same name as the class and no return type.

**Purpose:**
- Initializes the object's state by setting initial values for attributes.

**Example:**
```java
public class MyClass {
    int x;

    // Constructor
    public MyClass(int initialValue) {
        x = initialValue;
    }
}
```

### 5. Instance Variable and Instance Method

**Instance Variable:**
- A variable defined in a class for which each instantiated object has its own copy.
- Example:
  ```java
  public class MyClass {
      int instanceVar;
  }
  ```

**Instance Method:**
- A method defined in a class that operates on instance variables and can be called on an object.
- Example:
  ```java
  public class MyClass {
      int instanceVar;

      public void instanceMethod() {
          System.out.println(instanceVar);
      }
  }
  ```

### 6. Subclass and Superclass

**Subclass:**
- A class that inherits from another class (superclass).
- Gains access to the superclass's methods and variables.

**Superclass:**
- The class being inherited from.

**Example:**
```java
public class Superclass {
    void display() {
        System.out.println("This is the superclass");
    }
}

public class Subclass extends Superclass {
    void display() {
        System.out.println("This is the subclass");
    }
}
```

### 7. Polymorphism

**Polymorphism:**
- The ability of different classes to respond to the same method call in different ways.
- Allows methods to do different things based on the object it is acting upon.

**Example:**
```java
class Animal {
    void sound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    void sound() {
        System.out.println("Dog barks");
    }
}

class Cat extends Animal {
    void sound() {
        System.out.println("Cat meows");
    }
}

public class TestPolymorphism {
    public static void main(String[] args) {
        Animal a;
        a = new Dog();
        a.sound();
        a = new Cat();
        a.sound();
    }
}
```

### 8. Garbage Collection in Java

**Garbage Collection:**
- Automatic memory management that reclaims memory occupied by objects no longer in use.
- Helps in preventing memory leaks by automatically freeing up memory.

**Alternative:**
- Manual memory management, where the programmer explicitly allocates and deallocates memory (e.g., `malloc` and `free` in C).

### 9. Importance of Inheritance

**Inheritance:**
- Allows a new class to inherit the properties and methods of an existing class.
- Promotes code reuse and logical hierarchy.

**Example:**
```java
public class Vehicle {
    public void start() {
        System.out.println("Vehicle is starting");
    }
}

public class Car extends Vehicle {
    public void honk() {
        System.out.println("Car is honking");
    }
}
```

### 10. Static Members

**Static Members:**
- Declared with the `static` keyword.
- Belong to the class rather than any instance of the class.
- Shared among all instances.

**Example:**
```java
public class MyClass {
    static int staticVar = 0;

    static void staticMethod() {
        System.out.println("Static method");
    }
}
```

### 11. Final Keyword

**Final Method/Class:**
- Cannot be overridden (method) or inherited (class).

**Example:**
```java
public final class FinalClass {}

public class MyClass {
    public final void finalMethod() {}
}
```

### 12. Using "this" Keyword

**"this":**
- Refers to the current instance of the class.
- Used to avoid naming conflicts and to pass the current object as a parameter.

**Example:**
```java
public class MyClass {
    int x;

    MyClass(int x) {
        this.x = x;
    }
}
```

### 13. Inner Classes

**Inner Classes:**
- Classes defined within another class.
- Can access members of the outer class.

**Example:**
```java
public class Outer {
    class Inner {
        void display() {
            System.out.println("This is an inner class");
        }
    }
}
```

### 14. Super Keyword

**super in Overriding:**
- Used to call a superclass method from a subclass.

**Example:**
```java
class Base {
    void show() {
        System.out.println("Base show()");
    }
}

class Derived extends Base {
    void show() {
        super.show();
        System.out.println("Derived show()");
    }
}
```

**super() in Constructor:**
- Calls the superclass constructor.

**Example:**
```java
class Base {
    Base() {
        System.out.println("Base constructor");
    }
}

class Derived extends Base {
    Derived() {
        super();
        System.out.println("Derived constructor");
    }
}
```

### 15. Hiding Base Class Variables

**Variable Hiding:**
- Occurs when a subclass defines a variable with the same name as one in the superclass.

**Accessing Hidden Variables:**
- Use `super` to reference the superclass variable.

**Example:**
```java
class Base {
    int x = 10;
}

class Derived extends Base {
    int x = 20;

    void display() {
        System.out.println(super.x);  // Accessing Base's x
    }
}
```