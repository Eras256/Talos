# Documento Técnico: TALOS AgentFi Runtime
**Versión:** 1.3.0 (Full Stack & Mobile Ready)
**Fecha:** Enero 2026
**Blockchain:** Sui (Testnet)

---

## 1. Resumen Ejecutivo
TALOS es una plataforma de **AgentFi (Agent Finance)** no custodial construida sobre la red **Sui**. Permite a los usuarios desplegar "Bóvedas Inteligentes" (Smart Vaults) que son gestionadas autónomamente por agentes de IA bajo estrictos permisos definidos en cadena (On-Chain Permissions).

La versión 1.3.0 consolida una arquitectura Full Stack robusta, con un frontend React moderno, integraciones profundas con la blockchain de Sui y un sistema de seguridad verificado.

---

## 2. Direcciones de Despliegue (Testnet V4)

| Recurso | ID |
|:---|:---|
| **Package ID** | `0x41f50b845ad5bcc097e61c0321ae86a335046f364877432088744906e2066eb2` |
| **Subscription Registry** | `0x3841cfc1c719eb397e92ce85b61cb3ebb57638e9cb1dbb53b4db3e9490639c4f` |
| **Mock USDC Treasury** | `0x0adbb4e66710502722cb24397ab37913f687f03211886824c0e84dbbc16b3988` |
| **Worker (Agent) Address** | `0x8bd468b0e5941e75484e95191d99ff6234b2ab24e3b91650715b6df8cf8e4eba` |

---

## 3. Arquitectura Frontend e Integraciones

TALOS utiliza una arquitectura frontend moderna centrada en la experiencia de usuario (UX) y la seguridad de la interacción con la blockchain.

### 3.1 Stack Tecnológico
*   **Framework:** Next.js 15 (App Router) para renderizado híbrido y optimización SEO.
*   **Estilos:** TailwindCSS para diseño utility-first + `framer-motion` para micro-interacciones (animaciones de entrada, hovers, transiciones).
*   **Lenguaje:** TypeScript estricto para type-safety en componentes y respuestas de la blockchain.

### 3.2 Integraciones Blockchain (`@mysten/dapp-kit`)
La comunicación con la red Sui se maneja a través del SDK oficial `dapp-kit`, implementando los siguientes patrones:

1.  **Gestión de Billetera:**
    *   `useCurrentAccount` y `useConnectWallet` para autenticación.
    *   Soporte para zkLogin (Google/Twitch) y Wallets estándar (Sui Wallet, etc.).
2.  **Lectura de Estado (RPC):**
    *   `useSuiClientQuery`: Utilizado para hacer fetching de objetos `OwnerCap` y detalles de `Vault` en tiempo real.
    *   **Estrategia de Datos:** Los datos se obtienen directamente de la blockchain (RPC Nodes), eliminando la necesidad de una base de datos backend para el estado crítico.
3.  **Escritura (Transacciones):**
    *   `useSignAndExecuteTransaction`: Hook principal para firmar y enviar PTBs.
    *   **PTBs (Programmable Transaction Blocks):**
        *   *Deploy Atómico:* `create_vault` + `transfer (Owner)` + `transfer (Agent)` en una sola transacción atómica.
        *   *Faucet:* Llamada a `mock_usdc::mint` para facilitar el testing.

### 3.3 Componentes Clave

#### A. `SubscriptionGate.tsx` (Monetización)
Componente de alto orden (HOC) que bloquea el acceso a funcionalidades premium.
*   **Lógica:** Consulta el objeto compartido `SubscriptionRegistry`. Verifica si `table[user_address].expiration > now`.
*   **UX:** Muestra un estado de "Locked" con efecto blur y un botón de pago directo si la suscripción no es válida.
*   **Seguridad:** La validación visual se respalda con validación on-chain en el contrato inteligente.

#### B. `Navbar.tsx` (Navegación & Utility)
*   **Responsive:** Implementa un menú hamburguesa con `AnimatePresence` para móviles.
*   **Faucet Integrado:** Botón visible solo en Testnet que inyecta Mock USDC a la cuenta conectada.
*   **Estado de Red:** Indicador visual de conexión a Testnet.

#### C. `GlassCard.tsx` (Design System)
*   Componente base para el lenguaje de diseño "Neural Glass".
*   Utiliza efectos debackdrop-blur, bordes semitransparentes y gradientes animados para dar sensación de profundidad y modernidad.

#### D. `AppShell.tsx` & `Providers.tsx`
*   Configura el `SuiClientProvider` y `QueryClientProvider` para manejar el contexto global de la DApp.
*   Maneja el modal legal (`LegalOnboardingModal`) que debe ser aceptado antes de interactuar.

---

## 4. Smart Contracts (`talos` Package)

### 4.1 Módulo `vault` (V2 - Hot Potato)
*   **Flash Loan Architecture:** Utiliza el patrón "Hot Potato" (`FlashReceipt`). El agente pide prestado (`borrow_flash`), ejecuta lógica arbitraria (PTB) y devuelve (`repay_flash`) en la misma transacción.
*   **Access Control:** Separación estricta de `OwnerCap` (Usuario) vs `AgentCap` (Worker).

### 4.2 Módulo `mock_usdc` (V4)
*   **Faucet Público:** TreasuryCap compartido para emitir `mUSDC` infinitos durante pruebas. Facilita la validación de estrategias multi-activo.

### 4.3 Módulo `subscription`
*   **Registro On-Chain:** Gestión descentralizada de accesos "Pro" mediante pagos recurrentes en SUI.

---

## 5. Backend Worker V2 & Caos

El worker es un servicio Node.js autónomo que opera en un entorno seguro (TEE ready).

### 5.1 Ciclo de Ejecución
1.  **Discovery:** Polling de objetos `AgentCap`.
2.  **Validación de Estrategia:** Simulación local de rentabilidad.
3.  **Ejecución:** Construcción y firma de PTBs.

### 5.2 Chaos Engineering
Resultados de las pruebas de estrés (`backend/src/chaos.ts`):
*   ✅ **Robo de Fondos:** Bloqueado por Hot Potato (Borrow != Repay).
*   ✅ **Acceso Ilegal:** Bloqueado por chequeo de `AgentCap`.
*   ✅ **Ejecución sin Pago:** Bloqueado por integración con `SubscriptionRegistry`.

---

## 6. Seguridad y Riesgos
1.  **Non-Custodial:** El protocolo nunca tiene acceso a los fondos del usuario para retiros.
2.  **Auditoría Continua:** Pruebas de integración automatizadas en cada despliegue.
3.  **Geo-Blocking:** Modal legal y verificación de IP (frontend) para cumplimiento normativo.

---

## 7. DevOps & Despliegue
*   **Pipeline:** Scripts (`publish.sh`) que compilan, testean, publican y actualizan automáticamente la configuración del frontend (`contracts.json`).
*   **Verificación:** Código fuente verificado en exploradores de bloques de Sui.



