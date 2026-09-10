import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ViewMode,
  AuthoritativeRole,
  ServiceItem,
  Order,
  Specialist,
  CustomerUser,
  AuditLog,
  OrderStatus,
  PaymentMethod
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_SPECIALISTS,
  CURRENT_CUSTOMER,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS
} from '../mockData';
import { setApiAuthRole } from '../api/client';

interface PlatformContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  authoritativeRole: AuthoritativeRole;
  setAuthoritativeRole: (role: AuthoritativeRole) => void;
  isPhoneFramed: boolean;
  setIsPhoneFramed: (framed: boolean) => void;
  services: ServiceItem[];
  orders: Order[];
  specialists: Specialist[];
  currentUser: CustomerUser;
  auditLogs: AuditLog[];
  activeTrackingOrderId: string;
  setActiveTrackingOrderId: (id: string) => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Actions
  placeOrder: (booking: {
    service: ServiceItem;
    date: string;
    timeSlot: string;
    notes?: string;
    paymentMethod: PaymentMethod;
    customAddress?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  assignSpecialist: (orderId: string, specialistId: string) => void;
  addService: (newService: Omit<ServiceItem, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateService: (service: ServiceItem) => void;
  toggleServiceAvailability: (serviceId: string) => void;
  simulateNewIncomingOrder: () => void;
  topUpWallet: (amount: number) => void;
  resetAllData: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('dual_view');
  const [authoritativeRole, setAuthoritativeRole] = useState<AuthoritativeRole>('super_admin');
  const [isPhoneFramed, setIsPhoneFramed] = useState<boolean>(true);

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('omniflow_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('omniflow_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [specialists, setSpecialists] = useState<Specialist[]>(() => {
    const saved = localStorage.getItem('omniflow_specialists');
    return saved ? JSON.parse(saved) : INITIAL_SPECIALISTS;
  });

  const [currentUser, setCurrentUser] = useState<CustomerUser>(() => {
    const saved = localStorage.getItem('omniflow_customer');
    return saved ? JSON.parse(saved) : CURRENT_CUSTOMER;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('omniflow_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>('ord-1001');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Sync state to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('omniflow_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('omniflow_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('omniflow_specialists', JSON.stringify(specialists));
  }, [specialists]);

  useEffect(() => {
    localStorage.setItem('omniflow_customer', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('omniflow_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    setApiAuthRole(authoritativeRole);
  }, [authoritativeRole]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const addAuditLog = (actorRole: AuthoritativeRole | 'customer' | 'system', actorName: string, action: string, details: string, orderNumber?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: timeStr,
      actorRole,
      actorName,
      action,
      details,
      orderNumber
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const placeOrder = (booking: {
    service: ServiceItem;
    date: string;
    timeSlot: string;
    notes?: string;
    paymentMethod: PaymentMethod;
    customAddress?: string;
  }): Order => {
    const orderNum = 'ON-' + (8924 + Math.floor(Math.random() * 900));
    const orderId = 'ord-' + Date.now();
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const finalPrice = Math.max(10, booking.service.price - 10);

    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNum,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerEmail: currentUser.email,
      customerAddress: booking.customAddress || currentUser.address,
      serviceId: booking.service.id,
      serviceName: booking.service.name,
      serviceCategory: booking.service.category,
      servicePrice: booking.service.price,
      discount: 10,
      totalAmount: finalPrice,
      status: 'pending',
      paymentMethod: booking.paymentMethod,
      paymentStatus: 'paid',
      scheduledDate: booking.date,
      scheduledTimeSlot: booking.timeSlot,
      notes: booking.notes,
      currentStepProgress: 15,
      etaMinutes: 45,
      createdAt: `${now.toISOString().split('T')[0]} ${timeFormatted}`,
      timeline: [
        {
          status: 'pending',
          timestamp: timeFormatted,
          title: 'Booking Placed',
          description: `Customer booked ${booking.service.name} for ${booking.date} (${booking.timeSlot}).`
        }
      ]
    };

    // Deduct wallet balance if paid via wallet and increment total spend
    if (booking.paymentMethod === 'wallet') {
      setCurrentUser(prev => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - finalPrice),
        totalSpent: prev.totalSpent + finalPrice
      }));
    } else {
      setCurrentUser(prev => ({
        ...prev,
        totalSpent: prev.totalSpent + finalPrice
      }));
    }

    setOrders(prev => [newOrder, ...prev]);
    setActiveTrackingOrderId(orderId);

    addAuditLog('customer', currentUser.name, 'Order Placed', `Created order #${orderNum} for $${newOrder.totalAmount}.00 (${booking.paymentMethod})`, orderNum);
    showToast(`Order #${orderNum} placed! Awaiting dispatcher assignment.`, 'success');

    return newOrder;
  };

  const topUpWallet = (amount: number) => {
    setCurrentUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount
    }));
    addAuditLog('customer', currentUser.name, 'Wallet Top-Up', `Added $${amount.toFixed(2)} to digital wallet`);
    showToast(`+$${amount.toFixed(2)} added to OmniFlow Wallet!`, 'success');
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let progress = 15;
    let eta = 45;
    if (newStatus === 'confirmed') { progress = 30; eta = 35; }
    if (newStatus === 'assigned') { progress = 50; eta = 20; }
    if (newStatus === 'in_progress') { progress = 80; eta = 10; }
    if (newStatus === 'completed') { progress = 100; eta = 0; }
    if (newStatus === 'cancelled') { progress = 0; eta = 0; }

    const roleName = authoritativeRole === 'super_admin' ? 'Super Admin' : authoritativeRole === 'ops_manager' ? 'Operations Manager' : 'Support Lead';

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const statusTitleMap: Record<OrderStatus, string> = {
        pending: 'Order Pending',
        confirmed: 'Order Confirmed',
        assigned: 'Specialist Dispatched',
        in_progress: 'Service Underway',
        completed: 'Job Completed & Verified',
        cancelled: 'Order Cancelled'
      };

      const newTimelineItem = {
        status: newStatus,
        timestamp: timeFormatted,
        title: statusTitleMap[newStatus],
        description: note || `Status updated by ${roleName}.`
      };

      return {
        ...order,
        status: newStatus,
        currentStepProgress: progress,
        etaMinutes: eta,
        timeline: [...order.timeline, newTimelineItem]
      };
    }));

    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      addAuditLog(authoritativeRole, roleName, `Status -> ${newStatus.toUpperCase()}`, note || `Moved order to ${newStatus}`, targetOrder.orderNumber);
      showToast(`Order #${targetOrder.orderNumber} updated to ${newStatus.toUpperCase()}`, 'info');
    }
  };

  const assignSpecialist = (orderId: string, specialistId: string) => {
    const spec = specialists.find(s => s.id === specialistId);
    if (!spec) return;

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const roleName = authoritativeRole === 'super_admin' ? 'Super Admin' : 'Operations Manager';

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const newTimelineItem = {
        status: 'assigned' as OrderStatus,
        timestamp: timeFormatted,
        title: 'Specialist Assigned',
        description: `${spec.name} (${spec.specialty}) dispatched to location.`
      };

      return {
        ...order,
        status: 'assigned',
        specialistId: spec.id,
        specialistName: spec.name,
        specialistPhone: spec.phone,
        specialistAvatar: spec.avatar,
        specialistRating: spec.rating,
        currentStepProgress: 50,
        etaMinutes: 18,
        timeline: [...order.timeline, newTimelineItem]
      };
    }));

    setSpecialists(prev => prev.map(s => s.id === specialistId ? { ...s, status: 'on_route' } : s));

    const targetOrder = orders.find(o => o.id === orderId);
    const orderNum = targetOrder ? targetOrder.orderNumber : orderId;
    addAuditLog(authoritativeRole, roleName, 'Specialist Assigned', `Dispatched ${spec.name} to order #${orderNum}`, orderNum);
    showToast(`Dispatched ${spec.name} to order #${orderNum}`, 'success');
  };

  const addService = (newServiceData: Omit<ServiceItem, 'id' | 'rating' | 'reviewsCount'>) => {
    const newService: ServiceItem = {
      ...newServiceData,
      id: 'srv-' + Date.now(),
      rating: 5.0,
      reviewsCount: 1
    };
    setServices(prev => [newService, ...prev]);
    addAuditLog(authoritativeRole, 'Admin', 'Service Created', `Added new service: ${newService.name}`);
    showToast(`New service "${newService.name}" created!`, 'success');
  };

  const updateService = (updated: ServiceItem) => {
    setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
    addAuditLog(authoritativeRole, 'Admin', 'Service Updated', `Modified ${updated.name} pricing to $${updated.price}`);
    showToast(`Service "${updated.name}" updated!`, 'info');
  };

  const toggleServiceAvailability = (serviceId: string) => {
    setServices(prev => prev.map(s => {
      if (s.id !== serviceId) return s;
      const nextState = !s.available;
      addAuditLog(authoritativeRole, 'Admin', nextState ? 'Service Enabled' : 'Service Paused', `${s.name} marked as ${nextState ? 'Available' : 'Unavailable'}`);
      showToast(`${s.name} is now ${nextState ? 'Available' : 'Unavailable'}`, 'info');
      return { ...s, available: nextState };
    }));
  };

  const simulateNewIncomingOrder = () => {
    const randomService = services[Math.floor(Math.random() * services.length)];
    const mockNames = ['Taylor Swift', 'Jordan Peterson', 'Maya Lin', 'Liam Neeson', 'Sophia Chen'];
    const chosenName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const orderNum = 'ON-' + (8950 + Math.floor(Math.random() * 500));
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      customerId: 'cust-sim-' + Math.floor(Math.random() * 999),
      customerName: chosenName,
      customerPhone: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
      customerEmail: chosenName.toLowerCase().replace(' ', '.') + '@customer.io',
      customerAddress: '884 Lexington Boulevard, Apt ' + Math.floor(1 + Math.random() * 50) + ', Metro Heights',
      serviceId: randomService.id,
      serviceName: randomService.name,
      serviceCategory: randomService.category,
      servicePrice: randomService.price,
      discount: 0,
      totalAmount: randomService.price,
      status: 'pending',
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
      scheduledDate: 'Today',
      scheduledTimeSlot: 'Within 2 Hours',
      notes: 'Customer requested prompt arrival.',
      currentStepProgress: 15,
      etaMinutes: 30,
      createdAt: `${now.toISOString().split('T')[0]} ${timeFormatted}`,
      timeline: [
        {
          status: 'pending',
          timestamp: timeFormatted,
          title: 'Order Placed (Simulated)',
          description: `${chosenName} booked ${randomService.name}.`
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    addAuditLog('customer', chosenName, 'Simulated Order Influx', `Inbound request #${orderNum} for ${randomService.name}`, orderNum);
    showToast(`Incoming Order Alert: #${orderNum} from ${chosenName}!`, 'warning');
  };

  const resetAllData = () => {
    localStorage.removeItem('omniflow_services');
    localStorage.removeItem('omniflow_orders');
    localStorage.removeItem('omniflow_specialists');
    localStorage.removeItem('omniflow_customer');
    localStorage.removeItem('omniflow_audit_logs');
    setServices(INITIAL_SERVICES);
    setOrders(INITIAL_ORDERS);
    setSpecialists(INITIAL_SPECIALISTS);
    setCurrentUser(CURRENT_CUSTOMER);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveTrackingOrderId('ord-1001');
    showToast('Demo data successfully restored to default state.', 'info');
  };

  return (
    <PlatformContext.Provider
      value={{
        viewMode,
        setViewMode,
        authoritativeRole,
        setAuthoritativeRole,
        isPhoneFramed,
        setIsPhoneFramed,
        services,
        orders,
        specialists,
        currentUser,
        auditLogs,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        toast,
        showToast,
        placeOrder,
        updateOrderStatus,
        assignSpecialist,
        addService,
        updateService,
        toggleServiceAvailability,
        simulateNewIncomingOrder,
        topUpWallet,
        resetAllData
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
