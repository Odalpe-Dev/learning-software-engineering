# Programación Orientada a Objetos

La **Programación Orientada a Objetos (POO)** es un paradigma de programación que se basa en el concepto de "objetos" para modelar entidades del mundo real. Cada objeto tiene atributos (datos) y métodos (funciones) que definen su comportamiento y características.

En la POO, los objetos interactúan entre sí a través de mensajes, lo que permite la creación de sistemas complejos y modulares. Este enfoque se basa en los siguientes principios fundamentales:

- **Encapsulamiento**: Los datos y métodos de un objeto están relacionados y se agrupan en una sola entidad.
- **Abstracción**: Los objetos representan entidades del mundo real y ocultan los detalles de implementación.
- **Herencia**: Los objetos pueden heredar atributos y métodos de otros objetos.
- **Polimorfismo**: Los objetos pueden tomar diferentes formas y comportarse de manera distinta según el contexto.

La POO se utiliza en una amplia variedad de lenguajes de programación, como Java, C++, Python, Ruby y JavaScript, entre otros. A continuación, exploraremos los conceptos clave de la Programación Orientada a Objetos y cómo se aplican en la práctica.

## Clases y Objetos

Una **clase** es un molde o plantilla que define la estructura y comportamiento de un objeto. Contiene atributos (datos) y métodos (funciones) que describen las características y acciones que puede realizar un objeto de esa clase.
Un **objeto** es una instancia de una clase, es decir, un objeto concreto que se crea a partir de la plantilla definida por la clase. Cada objeto tiene sus propios valores para los atributos y puede invocar los métodos definidos en la clase.

### Ejemplo de Clase y Objeto en TypeScript

```typescript
class Persona {
  nombre: string;
  edad: number;

  constructor(nombre: string, edad: number) {
    this.nombre = nombre;
    this.edad = edad;
  }

  saludar() {
    console.log(`Hola, mi nombre es ${this.nombre} y tengo ${this.edad} años.`);
  }
}

// Crear un objeto de la clase Persona
const persona1 = new Persona('Juan', 30);
persona1.saludar(); // Output: Hola, mi nombre es Juan y tengo 30 años.

```

En este ejemplo, `Persona` es una clase que define la estructura y comportamiento de un objeto `Persona`. El objeto `persona1` se crea a partir de la clase `Persona` y se inicializa con los valores `'Juan'` y `30` para los atributos `nombre` y `edad`, respectivamente. Al llamar al método `saludar()` del objeto `persona1`, se muestra un mensaje con los datos de la persona.

## Métodos y Propiedades

Los **métodos** son funciones que se definen dentro de una clase y se utilizan para realizar acciones o cálculos específicos. Los métodos pueden acceder a los datos de la clase a través de la palabra clave `this`.

Las **propiedades** son variables que se definen dentro de una clase y se utilizan para almacenar datos relacionados con el objeto. Las propiedades pueden tener diferentes tipos de datos, como cadenas, números, arreglos u otros objetos.

### Ejemplo de Métodos y Propiedades en TypeScript

```typescript
class Coche {
  marca: string;
  modelo: string;
  velocidad: number = 0;

  constructor(marca: string, modelo: string) {
    this.marca = marca;
    this.modelo = modelo;
  }

  acelerar(velocidad: number) {
    this.velocidad += velocidad;
    console.log(`El coche aceleró a ${this.velocidad} km/h.`);
  }

  frenar() {
    this.velocidad = 0;
    console.log('El coche se detuvo.');
  }
}

// Crear un objeto de la clase Coche
const coche1 = new Coche('Toyota', 'Corolla');
coche1.acelerar(50); // Output: El coche aceleró a 50 km/h.
coche1.frenar(); // Output: El coche se detuvo.

```

En este ejemplo, `Coche` es una clase que define la estructura y comportamiento de un objeto `Coche`. El objeto `coche1` se crea a partir de la clase `Coche` y se inicializa con los valores `'Toyota'` y `'Corolla'` para las propiedades `marca` y `modelo`, respectivamente. Al llamar a los métodos `acelerar()` y `frenar()` del objeto `coche1`, se modifican los valores de la propiedad `velocidad` y se muestran mensajes correspondientes.

## Encapsulamiento

El encapsulamiento es un principio fundamental de la POO que consiste en agrupar los datos (atributos) y los métodos (comportamientos) relacionados con un objeto dentro de una sola unidad, llamada clase. Además, se controla el acceso a estos datos y métodos, permitiendo únicamente interacciones controladas desde el exterior de la clase.

El encapsulamiento permite ocultar la complejidad interna de una clase, proporcionando una interfaz controlada para interactuar con los objetos de esa clase. Esto mejora la seguridad y la integridad de los datos, ya que solo se pueden modificar a través de métodos específicos de la clase, permitiendo así una validación adecuada antes de realizar cualquier cambio.

Los niveles de acceso en TypeScript son los siguientes:

- **Public**: Es el nivel más bajo de protección y permite que toda clase que se extienda o desde el exterior pueda acceder a sus datos.
- **Private**: Las propiedades o métodos definidos con este nivel solo pueden ser vistos dentro de la misma clase que los define; desde ningún otro lugar fuera de la misma se puede acceder.
- **Protected**: No se puede acceder desde cualquier lugar, solamente permite el acceso a los métodos o propiedades desde la clase que se crea o en las clases que la heredan.

### Ejemplo de Encapsulamiento en TypeScript

En este ejemplo, se muestra cómo se puede aplicar el encapsulamiento en una clase `BankAccount` para proteger el atributo `balance` y controlar las operaciones de depósito y retiro de fondos.

```typescript
class BankAccount {
  private balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  public deposit(amount: number) {
    if (amount > 0) {
      this.balance += amount;
      console.log(`Deposited: $${amount}. New balance: $${this.balance}`);
    } else {
      console.log('Deposit amount must be positive.');
    }
  }

  public withdraw(amount: number) {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      console.log(`Withdrew: $${amount}. New balance: $${this.balance}`);
    } else {
      console.log('Invalid withdraw amount.');
    }
  }

  public getBalance() {
    return this.balance;
  }
}

// Create a new bank account with an initial balance
const account = new BankAccount(1000);
account.deposit(500); // Output: Deposited: $500. New balance: $1500
account.withdraw(200); // Output: Withdrew: $200. New balance: $1300
console.log(`Current balance: $${account.getBalance()}`); // Output: Current balance: $1300
```

En este ejemplo, la clase `BankAccount` encapsula el atributo `balance` como privado y proporciona métodos públicos para depositar, retirar y obtener el saldo de la cuenta. Esto garantiza que el saldo solo se pueda modificar a través de los métodos de la clase y se puedan realizar validaciones adecuadas antes de realizar operaciones de depósito y retiro.

## Herencia

La **herencia** es la capacidad de crear una nueva clase a partir de una clase existente, aprovechando sus atributos y métodos. La clase que se hereda se conoce como **clase base** o **superclase**, y la nueva clase se conoce como **clase derivada** o **subclase**.

La herencia permite reutilizar el código existente, extender la funcionalidad de una clase y organizar las clases en una jerarquía. Una subclase hereda los atributos y métodos de la superclase y puede agregar nuevos atributos y métodos, modificar los existentes o redefinirlos.

### Ejemplo de Herencia en TypeScript

En este ejemplo, se muestra cómo se puede utilizar la herencia para crear clases derivadas `SavingsAccount` y `CheckingAccount` a partir de una clase base `BankAccount` que proporciona funcionalidad común para todas las cuentas bancarias.

```typescript
class BankAccount {
  protected balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  public deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
      console.log(`Deposited: $${amount}. New balance: $${this.balance}`);
    } else {
      console.log('Deposit amount must be positive.');
    }
  }

  public withdraw(amount: number): void {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      console.log(`Withdrew: $${amount}. New balance: $${this.balance}`);
    } else {
      console.log('Invalid withdraw amount.');
    }
  }

  public getBalance(): number {
    return this.balance;
  }
}

class SavingsAccount extends BankAccount {
  private interestRate: number;

  constructor(initialBalance: number, interestRate: number) {
    super(initialBalance);
    this.interestRate = interestRate;
  }

  public applyInterest(): void {
    const interest = this.balance * this.interestRate / 100;
    this.balance += interest;
    console.log(`Interest applied: $${interest}. New balance: $${this.balance}`);
  }
}

class CheckingAccount extends BankAccount {
  private transactionLimit: number;

  constructor(initialBalance: number, transactionLimit: number) {
    super(initialBalance);
    this.transactionLimit = transactionLimit;
  }

  public withdraw(amount: number): void {
    if (amount > this.transactionLimit) {
      console.log(`Transaction limit exceeded. Limit: $${this.transactionLimit}`);
    } else {
      super.withdraw(amount);
    }
  }
}

// Create instances of SavingsAccount and CheckingAccount
const savings = new SavingsAccount(1000, 5);
savings.deposit(500);
savings.applyInterest(); // Output: Interest applied: $75. New balance: $1575

const checking = new CheckingAccount(2000, 500);
checking.withdraw(600); // Output: Transaction limit exceeded. Limit: $500
checking.withdraw(300); // Output: Withdrew: $300. New balance: $1700
```

En este ejemplo, la clase `BankAccount` es la clase base que define la funcionalidad común para todas las cuentas bancarias. Las clases derivadas `SavingsAccount` y `CheckingAccount` heredan los métodos de la clase base y agregan funcionalidades específicas para las cuentas de ahorro y corriente, respectivamente.

## Polimorfismo

El **polimorfismo** es la capacidad de un objeto de tomar diferentes formas y comportarse de manera distinta según el contexto. En la programación orientada a objetos, el polimorfismo permite que un objeto de una clase base pueda ser tratado como un objeto de una clase derivada.

El polimorfismo se basa en la herencia y el principio de sustitución de Liskov, que establece que un objeto de una clase derivada puede ser utilizado en lugar de un objeto de la clase base sin afectar el comportamiento del programa.

### Ejemplo de Polimorfismo en TypeScript

En este ejemplo, se muestra cómo diferentes clases derivadas pueden redefinir un método de la clase base y cómo se puede utilizar el polimorfismo para procesar diferentes tipos de transacciones.

```typescript
class Transaction {
  process() {
    console.log('Processing generic transaction');
  }
}

class Transfer extends Transaction {
  process() {
    console.log('Processing bank transfer');
  }
}

class CardPayment extends Transaction {
  process() {
    console.log('Processing credit card payment');
  }
}

function executeTransaction(transaction: Transaction) {
  transaction.process();
}

const transfer = new Transfer();
const cardPayment = new CardPayment();
const genericTransaction = new Transaction();

executeTransaction(transfer); // Output: Processing bank transfer
executeTransaction(cardPayment); // Output: Processing credit card payment
executeTransaction(genericTransaction); // Output: Processing generic transaction

```

En este ejemplo, la clase `Transaction` es la clase base y las clases `Transfer` y `CardPayment` son clases derivadas que redefinen el método `process()`. Al llamar a la función `executeTransaction()` con diferentes tipos de transacciones, se muestra el mensaje correspondiente según el tipo de transacción.

## Ventajas

La Programación Orientada a Objetos ofrece una serie de ventajas que la hacen ampliamente utilizada en el desarrollo de software:

- **Modularidad**: La programación orientada a objetos permite dividir el código en módulos reutilizables (clases) que facilitan la organización y mantenimiento del software.
- **Reutilización de código**: Al definir clases y objetos, se puede reutilizar el código existente en diferentes partes del programa, lo que reduce la duplicación y mejora la consistencia.
- **Flexibilidad**: La programación orientada a objetos permite la creación de objetos que pueden cambiar de forma dinámica y adaptarse a diferentes situaciones.
- **Facilidad de mantenimiento**: Al utilizar clases y objetos, se puede modificar o agregar funcionalidades de forma aislada sin afectar otras partes del programa.
- **Mejora de la legibilidad**: La programación orientada a objetos utiliza nombres significativos y estructuras claras que facilitan la comprensión del código.

## Desventajas

La programación orientada a objetos también tiene algunas desventajas:

- **Curva de aprendizaje**: La programación orientada a objetos puede ser más compleja de aprender para programadores principiantes debido a la cantidad de conceptos y técnicas involucradas.
- **Sobrecarga de memoria y procesamiento**: Al utilizar objetos y clases, se puede incurrir en una sobrecarga de memoria y procesamiento debido a la creación y gestión de objetos.
- **Dependencia de la clase**: Los objetos pueden estar fuertemente acoplados a las clases, lo que puede dificultar la reutilización y la modificación de código.
- **Dificultad de depuración**: La programación orientada a objetos puede hacer que la depuración de errores sea más compleja debido a la interacción entre diferentes objetos y clases.

## Casos de Uso

La Programación Orientada a Objetos se utiliza en una amplia variedad de casos de uso, incluidos:

- Desarrollo de aplicaciones web y móviles que requieren una estructura modular y escalable.
- Desarrollo de aplicaciones grandes y complejas que requieren una estructura modular y organizada.
- Sistemas donde los datos y su comportamiento están estrechamente relacionados y se pueden modelar como objetos.
