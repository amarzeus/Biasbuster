import { renderHook, act } from '@testing-library/react-hooks';
import { useNotifications } from '../useNotifications';
import { NotificationType } from '../../components/dashboard/NotificationSystem';

describe('useNotifications', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should add a notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification('success' as NotificationType, 'Test notification');
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].message).toBe('Test notification');
    expect(result.current.notifications[0].type).toBe('success');
  });

  it('should remove a notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification('success' as NotificationType, 'Test notification');
    });

    const notificationId = result.current.notifications[0].id;

    act(() => {
      result.current.removeNotification(notificationId);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification('success' as NotificationType, 'Test notification 1');
      result.current.addNotification('warning' as NotificationType, 'Test notification 2');
    });

    expect(result.current.notifications).toHaveLength(2);

    act(() => {
      result.current.clearNotifications();
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should auto-remove notification after 5 seconds', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification('success' as NotificationType, 'Test notification');
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should not remove notification before 5 seconds', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification('success' as NotificationType, 'Test notification');
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(result.current.notifications).toHaveLength(1);
  });

  it('should maintain multiple notifications', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification('success' as NotificationType, 'Test notification 1');
      result.current.addNotification('warning' as NotificationType, 'Test notification 2');
      result.current.addNotification('error' as NotificationType, 'Test notification 3');
    });

    expect(result.current.notifications).toHaveLength(3);
    expect(result.current.notifications[0].message).toBe('Test notification 1');
    expect(result.current.notifications[1].message).toBe('Test notification 2');
    expect(result.current.notifications[2].message).toBe('Test notification 3');
  });
}); 